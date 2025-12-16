import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Product } from '@core/models/product.model';
import { ProductFilter } from '@core/models/product-filter.model';
import { PRODUCTS_MOCK } from '@core/mocks/products.mock';
import { STORAGE_KEYS } from '@core/constants/storage-keys';

@Injectable({ providedIn: 'root' })
/**
 * Servicio principal para manejar productos dentro de la plataforma.
 *
 * Responsabilidades:
 * - Cargar productos desde:
 *    1) localStorage (cache)
 *    2) JSON publicado (GitHub Pages o assets)
 *    3) PRODUCTS_MOCK como último fallback
 * - Exponer lista reactiva con Signals.
 * - Aplicar filtros combinados (categoría, condición, búsqueda, precio).
 * - Ordenar resultados (precio, más recientes, etc.).
 * - Proveer CRUD local (create/update/delete) con persistencia en localStorage.
 * - Soportar bandera `isPreSale` para la sección de preventas.
 *
 * NOTA:
 * GitHub Pages solo permite GET. Los "POST/PUT/DELETE" se simulan
 * modificando el arreglo en memoria + localStorage.
 *
 * IMPORTANTE (Angular Signals):
 * - No se permite escribir signals dentro de `computed()`.
 * - Por eso:
 *    - `setFilter()` escribe en _activeFilter (debe llamarse desde eventos).
 *    - `filter()` es puro (no escribe signals) y puede usarse sin romper NG0600.
 */
export class ProductService {
  // ============================================================
  // 0) DEPENDENCIAS Y CONSTANTES
  // ============================================================

  private readonly http = inject(HttpClient);

  /** Clave para localStorage (centralizada en STORAGE_KEYS). */
  private readonly storageKey = STORAGE_KEYS.PRODUCTS;

  /**
   * URL del JSON remoto.
   *
   * ✅ Para desarrollo local con PROXY:
   *    remoteUrl = '/JSON_API/products.json'
   *    y ejecutar: ng serve --proxy-config proxy.conf.json
   *
   * ✅ Para usar JSON local empaquetado:
   *    remoteUrl = 'assets/data/products.json'
   */
  private readonly remoteUrl = '/JSON_API/products.json';

  /**
   * Imagen por defecto (fallback).
   * Se usa cuando el producto viene sin imageUrl (vacío, null o undefined).
   */
  private readonly FALLBACK_IMAGE_URL =
    'https://polarvectors.com/wp-content/uploads/2023/06/Guitar-SVG.jpg';

  // ============================================================
  // 1) STATE REACTIVO: productos + filtro activo
  // ============================================================

  /**
   * Lista interna de productos en memoria.
   * Se inicializa vacía y se carga en el constructor.
   */
  private readonly _products = signal<Product[]>([]);

  /** Versión readonly para usar en componentes. */
  readonly products = this._products.asReadonly();

  /**
   * Filtro activo (para modo reactivo).
   * Se actualiza con setFilter().
   */
  private readonly _activeFilter = signal<ProductFilter | null>(null);

  /** Filtro activo readonly (para debugging / UI avanzada). */
  readonly activeFilter = this._activeFilter.asReadonly();

  /**
   * Lista filtrada reactiva basada en:
   * - getActive()
   * - _activeFilter()
   */
  readonly filteredProducts = computed(() => {
    const all = this.getActive();
    const filter = this._activeFilter();

    // Si no hay filtro activo, devolvemos ordenado por fecha (más nuevos primero)
    if (!filter) return this.sortByDateDesc(all);

    return this.applyFilterInternal(all, filter);
  });

  // ============================================================
  // 2) CONSTRUCTOR: carga inicial (localStorage → JSON → MOCK)
  // ============================================================

  constructor() {
    this.bootstrapData();
  }

  /**
   * Carga inicial de productos:
   * 1) Intenta desde localStorage.
   * 2) Si no hay data válida, carga desde JSON remoto.
   * 3) Si falla el JSON, usa PRODUCTS_MOCK.
   */
  private bootstrapData(): void {
    // SSR/tests: puede no existir window/localStorage
    if (typeof window === 'undefined') {
      this._products.set([]);
      return;
    }

    // 1) Intentar leer desde localStorage
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Product[];
        this._products.set(this.normalizeList(parsed));
        return;
      } catch (e) {
        console.warn(
          '[ProductService] Error parseando localStorage, se ignora.',
          e,
        );
        localStorage.removeItem(this.storageKey);
      }
    }

    // 2) Intentar cargar desde JSON remoto
    this.http.get<Product[]>(this.remoteUrl).subscribe({
      next: (data) => {
        this._products.set(this.normalizeList(data));
        this.persistToStorage();
      },
      error: (err) => {
        console.error(
          '[ProductService] Error cargando JSON remoto, usando PRODUCTS_MOCK.',
          err,
        );
        // 3) Fallback a MOCK
        this._products.set(this.normalizeList(PRODUCTS_MOCK));
        this.persistToStorage();
      },
    });
  }

  /**
   * Normaliza la lista:
   * - Asegura slug.
   * - Asegura createdAt.
   * - Asegura isActive por defecto.
   * - Asegura imageUrl con fallback si viene vacío.
   */
  private normalizeList(list: Product[]): Product[] {
    return list.map((p) => {
      const slug = p.slug ?? this.slugify(p.name);
      const createdAt = p.createdAt ?? new Date().toISOString();

      // ✅ Fallback robusto para imagen
      const safeImageUrl =
        (p.imageUrl ?? '').toString().trim().length > 0
          ? (p.imageUrl as string).toString().trim()
          : this.FALLBACK_IMAGE_URL;

      return {
        ...p,
        slug,
        createdAt,
        imageUrl: safeImageUrl,
        isActive: p.isActive ?? true,
      };
    });
  }

  /**
   * Persiste el estado actual de productos en localStorage.
   */
  private persistToStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const value = JSON.stringify(this._products());
      localStorage.setItem(this.storageKey, value);
    } catch (e) {
      console.error('[ProductService] No se pudo persistir en localStorage.', e);
    }
  }

  /**
   * Ordena un arreglo de productos por fecha de creación DESC (más nuevos primero).
   */
  private sortByDateDesc(list: Product[]): Product[] {
    return [...list].sort(
      (a, b) =>
        new Date(b.createdAt ?? '').getTime() -
        new Date(a.createdAt ?? '').getTime(),
    );
  }

  /**
   * Genera un slug URL-safe desde el nombre del producto.
   */
  private slugify(name: string): string {
    return name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  /**
   * Restablece los productos desde el JSON original (remoto).
   * Útil para un botón "Restablecer catálogo" en el panel de Admin.
   */
  resetFromJson(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
    this.bootstrapData();
  }

  // ============================================================
  // 3) EXPOSICIÓN DE DATA (LECTURA)
  // ============================================================

  /**
   * Sobrescribe la lista completa de productos
   * y persiste el cambio en localStorage.
   */
  setAll(products: Product[]): void {
    this._products.set(this.normalizeList(products));
    this.persistToStorage();
  }

  /**
   * Devuelve todos los productos ordenados por fecha de creación
   * (más nuevos primero), sin filtrar por isActive.
   * Útil para vistas de administración.
   */
  getAll(): Product[] {
    return this.sortByDateDesc(this._products());
  }

  /**
   * Devuelve solo productos activos (isActive !== false).
   * Útil para vistas públicas.
   */
  getActive(): Product[] {
    return this.getAll().filter((p) => p.isActive !== false);
  }

  /**
   * Devuelve solo productos marcados como preventa.
   */
  getPreSales(): Product[] {
    return this.getActive().filter((p) => !!p.isPreSale);
  }

  /**
   * Busca un producto usando su `slug`.
   * Se usa al cargar la página de detalle `/productos/:slug`.
   */
  getBySlug(slug: string): Product | undefined {
    return this._products().find((p) => p.slug === slug);
  }

  // ============================================================
  // 4) FILTRADO (REACTIVO + IMPERATIVO)
  // ============================================================

  /**
   * ✅ Setter del filtro activo (modo reactivo).
   *
   * IMPORTANTE:
   * - Esto escribe signals, por lo tanto debe llamarse desde eventos
   *   (handlers) o constructor, nunca dentro de un computed().
   */
  setFilter(filter: ProductFilter | null): void {
    this._activeFilter.set(filter);
  }

  /**
   * Modo imperativo clásico: retorna el arreglo filtrado directamente
   * SIN escribir signals (evita NG0600 si se llama dentro de computed()).
   */
  filter(filter: ProductFilter): Product[] {
    const all = this.getActive();
    return this.applyFilterInternal(all, filter);
  }

  /**
   * Lógica central de filtrado (pura): NO toca signals.
   */
  private applyFilterInternal(all: Product[], filter: ProductFilter): Product[] {
    let result = [...all];

    // --- Categoría ---
    if (filter.category && filter.category !== 'todos') {
      result = result.filter((p) => p.category === filter.category);
    }

    // --- Condición ---
    if (filter.condition && filter.condition !== 'todos') {
      result = result.filter((p) => p.condition === filter.condition);
    }

    // --- Búsqueda ---
    if (filter.searchTerm && filter.searchTerm.trim()) {
      const term = filter.searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          (p.brand ?? '').toLowerCase().includes(term) ||
          (p.model ?? '').toLowerCase().includes(term) ||
          (p.tags ?? []).some((t) => t.toLowerCase().includes(term)),
      );
    }

    // --- Precio mínimo (fix TS18048) ---
    const minPrice = filter.minPrice;
    if (minPrice != null) {
      result = result.filter((p) => (p.price ?? 0) >= minPrice);
    }

    // --- Precio máximo (fix TS18048) ---
    const maxPrice = filter.maxPrice;
    if (maxPrice != null) {
      result = result.filter((p) => (p.price ?? 0) <= maxPrice);
    }

    // --- Ordenamiento ---
    switch (filter.sortBy) {
      case 'priceAsc':
        result.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;

      case 'priceDesc':
        result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;

      case 'recent':
      default:
        result = this.sortByDateDesc(result);
        break;
    }

    return result;
  }

  // ============================================================
  // 5) CRUD LOCAL PARA ADMIN
  // ============================================================

  /**
   * Crea un nuevo producto.
   * - Genera id con crypto.randomUUID si no viene.
   * - Genera slug si no viene.
   * - Marca isActive=true por defecto.
   */
  create(partial: Omit<Product, 'id'> | Product): Product {
    const id = (partial as Product).id ?? crypto.randomUUID();
    const slug = partial.slug ?? this.slugify(partial.name);

    // ✅ Asegurar fallback de imagen en creaciones
    const safeImageUrl =
      (partial.imageUrl ?? '').toString().trim().length > 0
        ? (partial.imageUrl as string).toString().trim()
        : this.FALLBACK_IMAGE_URL;

    const created: Product = {
      ...partial,
      id,
      slug,
      imageUrl: safeImageUrl,
      createdAt: partial.createdAt ?? new Date().toISOString(),
      isActive: partial.isActive ?? true,
    };

    this._products.update((list) => [...list, created]);
    this.persistToStorage();

    return created;
  }

  /**
   * Crea un nuevo producto directamente como PREVENTA.
   */
  createPreSale(partial: Omit<Product, 'id'> | Product): Product {
    return this.create({
      ...partial,
      isPreSale: true,
    });
  }

  /**
   * Actualiza un producto existente basado en su ID.
   */
  update(product: Product): void {
    // ✅ Si se edita y queda vacía la imagen, aplicamos fallback
    const safeImageUrl =
      (product.imageUrl ?? '').toString().trim().length > 0
        ? (product.imageUrl as string).toString().trim()
        : this.FALLBACK_IMAGE_URL;

    this._products.update((list) =>
      list.map((p) =>
        p.id === product.id ? { ...p, ...product, imageUrl: safeImageUrl } : p,
      ),
    );
    this.persistToStorage();
  }

  /**
   * Elimina un producto por ID.
   */
  deleteById(id: string): void {
    this._products.update((list) => list.filter((p) => p.id !== id));
    this.persistToStorage();
  }

  /**
   * Atajo para alternar flags booleanos (isFeatured, isOffer, isNew,
   * isActive, isPreSale, etc.).
   */
  toggleFlag(id: string, flag: keyof Product): void {
    this._products.update((list) =>
      list.map((p) =>
        p.id === id
          ? {
              ...p,
              [flag]: !p[flag],
            }
          : p,
      ),
    );
    this.persistToStorage();
  }

  // ============================================================
  // 6) CRUD COMPATIBLE CON TU API ANTERIOR
  // ============================================================

  /**
   * API antigua: agrega un producto.
   * Internamente delega a `create()`.
   */
  addProduct(product: Product): void {
    this.create(product);
  }

  /**
   * API antigua: actualiza un producto.
   * Internamente delega a `update()`.
   */
  updateProduct(updated: Product): void {
    this.update(updated);
  }

  /**
   * API antigua: elimina un producto.
   * Internamente delega a `deleteById()`.
   */
  deleteProduct(id: string): void {
    this.deleteById(id);
  }
}
