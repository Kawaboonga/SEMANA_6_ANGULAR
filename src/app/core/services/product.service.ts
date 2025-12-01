import { Injectable, signal } from '@angular/core';
import { Product } from '@core/models/product.model';
import { ProductFilter } from '@core/models/product-filter.model';
import { PRODUCTS_MOCK } from '@core/mocks/products.mock';


@Injectable({ providedIn: 'root' })
export class ProductService {
  // ============================================================
  // 1) DATA LOCAL (mock) - PRODUCTOS DE EJEMPLO
  // ============================================================
  // Mantengo los productos en un signal para poder trabajar de forma reactiva.
  // Más adelante esto se puede reemplazar por una API o un JSON externo.

  private readonly _products = signal<Product[]>(PRODUCTS_MOCK);

  
  // ============================================================
  // 2) EXPOSICIÓN DE DATA (READONLY)
  // ============================================================
  // Exposición de los productos como signal de solo lectura
  // (útil si en el futuro quieres usarlo reactivo directamente en componentes).
  products = this._products.asReadonly();

  // Método para sobrescribir la lista completa de productos.
  // Lo podría usar el Admin para sincronizar con un formulario o una fuente externa.
  setAll(products: Product[]): void {
    this._products.set([...products]);
  }

  // ============================================================
  // 3) MÉTODOS DE LECTURA Y FILTRADO
  // ============================================================
  // Devuelvo todos los productos ordenados por fecha de creación (más nuevos primero).
  getAll(): Product[] {
    return [...this._products()].sort(
      (a, b) =>
        new Date(b.createdAt ?? '').getTime() -
        new Date(a.createdAt ?? '').getTime(),
    );
  }

  // Busca un producto por slug.
  // Se usa en la página de detalle: /productos/:slug
  getBySlug(slug: string): Product | undefined {
    return this._products().find((p) => p.slug === slug);
  }

  // Aplica los filtros definidos en ProductFilter.
  // Esto lo usa la página de productos para combinar búsqueda, rango de precio, categoría, etc.
  filter(filter: ProductFilter): Product[] {
    let result = [...this._products()];

    // Filtro por categoría (guitarras, bajos, pedales, etc.).
    if (filter.category && filter.category !== 'todos') {
      result = result.filter((p) => p.category === filter.category);
    }

    // Filtro por condición (nuevo/usado).
    if (filter.condition && filter.condition !== 'todos') {
      result = result.filter((p) => p.condition === filter.condition);
    }

    // Búsqueda de texto por nombre, marca, modelo o tags.
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

    // Filtro por precio mínimo.
    if (filter.minPrice != null) {
      result = result.filter((p) => p.price >= filter.minPrice!);
    }

    // Filtro por precio máximo.
    if (filter.maxPrice != null) {
      result = result.filter((p) => p.price <= filter.maxPrice!);
    }

    // Ordenamiento según criterio seleccionado.
    switch (filter.sortBy) {
      case 'priceAsc':
        // Orden de menor a mayor precio.
        result.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        // Orden de mayor a menor precio.
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        // Si no hay sortBy, uso el criterio de "más nuevos primero".
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
