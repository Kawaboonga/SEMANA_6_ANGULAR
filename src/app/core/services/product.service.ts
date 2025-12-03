import { Injectable, signal } from '@angular/core';
import { Product } from '@core/models/product.model';
import { ProductFilter } from '@core/models/product-filter.model';
import { PRODUCTS_MOCK } from '@core/mocks/products.mock';

@Injectable({ providedIn: 'root' })
/**
 * Servicio principal para manejar productos dentro de la plataforma.
 *
 * Se encarga de:
 * - almacenar el listado de productos (por ahora mock local),
 * - exponerlos de manera reactiva con Signals,
 * - aplicar filtros combinados (categoría, precio, condición, búsqueda),
 * - ordenar resultados según distintos criterios,
 * - obtener productos individuales por slug,
 * - y permitir reemplazar toda la lista (útil en Admin).
 *
 * @usageNotes
 * - Los productos están en un `signal` solo para mantener la opción reactiva
 *   a futuro sin store externo.
 * - Cuando exista backend real, `_products` puede reemplazarse por una llamada HTTP.
 * - La página de productos usa este servicio para construir todo el filtrado dinámico.
 *
 * @example
 * // Obtener todos los productos:
 * const lista = this.productService.getAll();
 *
 * @example
 * // Buscar un producto puntual:
 * const p = this.productService.getBySlug('fender-player-telecaster');
 */
export class ProductService {
  // ============================================================
  // 1) DATA LOCAL (mock)
  // ============================================================

  /**
   * Lista interna de productos (mock temporal hasta tener backend real).
   * Se guarda en un signal para permitir reactividad opcional.
   */
  private readonly _products = signal<Product[]>(PRODUCTS_MOCK);

  // ============================================================
  // 2) EXPOSICIÓN DE DATA
  // ============================================================

  /**
   * Signal de solo lectura con todos los productos.
   * Útil si se quiere consumir reactividad directamente en los componentes.
   */
  products = this._products.asReadonly();

  /**
   * Sobrescribe la lista completa de productos.
   * Útil en el panel de Admin o en sincronizaciones futuras.
   *
   * @param products nueva lista completa
   */
  setAll(products: Product[]): void {
    this._products.set([...products]);
  }

  // ============================================================
  // 3) MÉTODOS DE LECTURA Y FILTRADO
  // ============================================================

  /**
   * Devuelve todos los productos ordenados por fecha de creación
   * (más nuevos primero).
   *
   * @returns Product[] ordenados
   *
   * @example
   * const productos = this.productService.getAll();
   */
  getAll(): Product[] {
    return [...this._products()].sort(
      (a, b) =>
        new Date(b.createdAt ?? '').getTime() -
        new Date(a.createdAt ?? '').getTime(),
    );
  }

  /**
   * Busca un producto usando su `slug`.
   * Se usa al cargar la página de detalle `/productos/:slug`.
   *
   * @param slug identificador del producto en la URL
   * @returns Product | undefined
   *
   * @example
   * const pedal = this.productService.getBySlug('boss-ds1-distortion');
   */
  getBySlug(slug: string): Product | undefined {
    return this._products().find((p) => p.slug === slug);
  }

  /**
   * Aplica los filtros definidos en `ProductFilter`.
   * Combina categoría, condición, búsqueda, rango de precio y ordenamiento.
   *
   * Se usa principalmente en la página de productos.
   *
   * @param filter filtros activos
   * @returns Product[] ya filtrados y ordenados
   *
   * @example
   * const resultado = this.productService.filter({
   *   category: 'guitarras',
   *   minPrice: 150000,
   *   sortBy: 'priceAsc'
   * });
   */
  filter(filter: ProductFilter): Product[] {
    let result = [...this._products()];

    // --- Filtro por categoría ---
    if (filter.category && filter.category !== 'todos') {
      result = result.filter((p) => p.category === filter.category);
    }

    // --- Filtro por condición ---
    if (filter.condition && filter.condition !== 'todos') {
      result = result.filter((p) => p.condition === filter.condition);
    }

    // --- Búsqueda por texto ---
    if (filter.searchTerm) {
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
      result = result.filter((p) => p.price >= filter.minPrice!);
    }

    // --- Precio máximo ---
    if (filter.maxPrice != null) {
      result = result.filter((p) => p.price <= filter.maxPrice!);
    }

    // --- Ordenamiento ---
    switch (filter.sortBy) {
      case 'priceAsc':
        result.sort((a, b) => a.price - b.price);
        break;

      case 'priceDesc':
        result.sort((a, b) => b.price - a.price);
        break;

      default:
        // Más nuevos primero
        result.sort(
          (a, b) =>
            new Date(b.createdAt ?? '').getTime() -
            new Date(a.createdAt ?? '').getTime(),
        );
        break;
    }

    return result;
  }
}
