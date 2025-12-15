
import {
  Injectable,
  computed,
  inject,
  signal,
} from '@angular/core';
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
  
   * usar el JSON local empaquetado por Angular, usar:
   *  - 'assets/data/products.json'
   */
  private readonly remoteUrl =
    //'assets/data/products.json'; // ← cambiar a URL de GitHub Pages.
    'https://kawaboonga.github.io/JSON_API/products.json';

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
   * Filtro activo opcional, para quienes quieran usar
   * el modo completamente reactivo.
   */
  private readonly _activeFilter = signal<ProductFilter | null>(null);

  /** Filtro activo readonly (para debugging / UI avanzada). */
  readonly activeFilter = this._activeFilter.asReadonly();

  /**
   * Lista filtrada reactiva, basada en:
   * - _products (solo activos)
   * - _activeFilter
   */
  readonly filteredProducts = computed(() => {
    const all = this.getActive(); // usamos solo productos activos
    const filter = this._activeFilter();

    // Si no hay filtro activo, devolvemos ordenado por fecha (más nuevos primero)
    if (!filter) {
      return this.sortByDateDesc(all);
    }

    let result = [...all];

    // --- Filtro por categoría ---
    if (filter.category && filter.category !== 'todos') {
      result = result.filter((p) => p.category === filter.category);
    }

    // --- Filtro por condición ---
    if (filter.condition && filter.condition !== 'todos') {
      result = result.filter((p) => p.condition === filter.condition);
    }

    // --- Búsqueda por texto ---
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

    // --- Precio mínimo ---
    if (filter.minPrice != null) {
      result = result.filter((p) => (p.price ?? 0) >= filter.minPrice!);
    }

    // --- Precio máximo ---
    if (filter.maxPrice != null) {
      result = result.filter((p) => (p.price ?? 0) <= filter.maxPrice!);
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
        console.warn('[ProductService] Error parseando localStorage, se ignora.', e);
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
   */
  private normalizeList(list: Product[]): Product[] {
    return list.map((p) => {
      const slug = p.slug ?? this.slugify(p.name);
      const createdAt = p.createdAt ?? new Date().toISOString();

      return {
        ...p,
        slug,
        createdAt,
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
      // No rompemos la app si falla localStorage.
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
  // 4) FILTRADO IMPERATIVO (API COMPATIBLE)
  // ============================================================

  /**
   * Aplica los filtros definidos en `ProductFilter`.
   * Combina categoría, condición, búsqueda, rango de precio y ordenamiento.
   *
   * Modo "imperativo" clásico: retorna el arreglo filtrado directamente
   * y además actualiza el filtro activo para quien quiera usar Signals.
   */
  filter(filter: ProductFilter): Product[] {
    this._activeFilter.set(filter);
    return this.filteredProducts();
  }

  // ============================================================
  // 5) CRUD LOCAL PARA ADMIN (NUEVA API)
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

    const created: Product = {
      ...partial,
      id,
      slug,
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
    this._products.update((list) =>
      list.map((p) => (p.id === product.id ? { ...p, ...product } : p)),
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
