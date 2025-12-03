
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { ProductService } from '@core/services/product.service';
import { ProductFilter } from '@core/models/product-filter.model';
import { ProductCategory } from '@core/models/product-category.model';

import { ProductCategoryBannerComponent } from '@shared/components/product-category-banner/product-category-banner';
import { ProductFiltersComponent } from '@shared/components/product-filters/product-filters';
import { ProductGridComponent } from '@shared/components/product-grid/product-grid';

import { FadeUpDirective } from '@shared/directives/fade-up';

/**
 * Componente que centraliza toda la lógica del módulo de productos.
 *
 * Su responsabilidad es:
 * - Leer la categoría principal desde la URL.
 * - Mantener los filtros secundarios (orden, condición, etc.).
 * - Combinar ambos filtros para producir la lista final mediante signals.
 * - Delegar la UI en componentes hijos totalmente “tontos”.
 * - Controla el banner de categoría
 * - Controla filtros secundarios (estado, orden, etc.)
 * - Produce la lista final mediante signals + computed
 * - Actúa como “smart component”: la UI vive en componentes hijos
 *
 * @usageNotes
 * - Si la ruta incluye :slug, este mismo componente sincroniza banner y filtros.
 * - `products` es un computed que siempre refleja el estado más reciente.
 * - Se usa signal() para mantener la reactividad interna sin depender de stores externos.
 *
 * @example
 * // Navegar a guitarras:
 * router.navigate(['/productos/categoria/guitarras']);
 */
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    ProductCategoryBannerComponent,
    ProductFiltersComponent,
    ProductGridComponent,
    FadeUpDirective,
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductListComponent {
  // ============================================================
  // INYECCIONES
  // ============================================================

  /** ActivatedRoute → lectura del slug de categoría */
  private route = inject(ActivatedRoute);

  /** ProductService → fuente única de productos + filtrado */
  private productService = inject(ProductService);

  // ============================================================
  // ESTADO: FILTRO SECUNDARIO
  // ============================================================

  /**
   * Filtros secundarios (orden, estado, búsqueda, etc.).
   * El banner y este filtro deben mantenerse sincronizados.
   */
  private _filter = signal<ProductFilter>({
    category: 'todos',
    sortBy: 'recent',
    condition: 'todos',
  });

  /** Versión de solo lectura para los hijos */
  filter = this._filter.asReadonly();

  // ============================================================
  // ESTADO: CATEGORÍA PRINCIPAL (banner)
  // ============================================================

  /**
   * Controla la categoría principal tomada desde la URL.
   * null   → /productos (sin categoría)
   * 'todos' → categoría libre
   * categoría real → guitarras, pedales, amplificadores...
   */
  bannerCategory = signal<ProductCategory | 'todos' | null>(null);

  // ============================================================
  // LISTA FINAL DE PRODUCTOS (computed)
  // ============================================================

  /**
   * Lista final de productos aplicada en orden:
   * 1) filter() del servicio → aplica filtros secundarios
   * 2) categoría principal del banner → override si corresponde
   *
   * @returns Product[]
   */
  products = computed(() => {
    // Paso 1: aplicar filtros desde el servicio
    let items = this.productService.filter(this._filter());

    // Paso 2: aplicar categoría del banner (si viene definida)
    const cat = this.bannerCategory();
    if (cat && cat !== 'todos') {
      items = items.filter(p => p.category === cat);
    }

    return items;
  });

  // ============================================================
  // CONSTRUCTOR → sincroniza URL con filtros
  // ============================================================

  /**
   * Lee cada actualización de /productos/:slug y sincroniza:
   * - bannerCategory
   * - filtro.category
   *
   * Si no existe slug → modo “todos los productos”.
   */
  constructor() {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug') as ProductCategory | 'todos' | null;

      if (slug && slug !== 'todos') {
        // Caso: categoría desde la URL
        this.bannerCategory.set(slug);
        this._filter.update(current => ({
          ...current,
          category: slug,
        }));
      } else {
        // Caso: sin categoría → listado completo
        this.bannerCategory.set(null);
        this._filter.update(current => ({
          ...current,
          category: 'todos',
        }));
      }
    });
  }

  // ============================================================
  // EVENTOS DESDE COMPONENTES HIJOS
  // ============================================================

  /**
   * Actualiza parcialmente los filtros secundarios.
   *
   * @param partial Objeto parcial con propiedades de ProductFilter.
   * @returns void
   *
   * @example
   * onFilterChange({ sortBy: 'priceAsc' });
   */
  onFilterChange(partial: Partial<ProductFilter>) {
    this._filter.update(current => ({ ...current, ...partial }));
  }

  /**
   * Cambia la categoría principal desde el banner superior.
   * Siempre sincroniza el filtro secundario.
   *
   * @param cat Categoría seleccionada o null.
   * @returns void
   */
  onBannerCategoryChange(cat: ProductCategory | 'todos' | null) {
    this.bannerCategory.set(cat);

    this._filter.update(current => ({
      ...current,
      category: cat ?? 'todos',
    }));
  }

  /**
   * Restablece:
   * - categoría principal
   * - categoría secundaria
   * - estado
   * - orden
   *
   * @returns void
   *
   * @example
   * onClearAll();
   */
  onClearAll() {
    this._filter.set({
      category: 'todos',
      sortBy: 'recent',
      condition: 'todos',
    });

    this.bannerCategory.set(null);
  }
}
