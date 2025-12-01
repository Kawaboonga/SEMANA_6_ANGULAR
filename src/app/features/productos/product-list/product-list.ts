// ============================================================================
// src/app/features/productos/product-list/product-list.ts
//
// Componente principal del listado de productos.
// - Controla el banner de categoría (categoría principal tomada desde la URL)
// - Controla filtros secundarios (estado, orden, etc.)
// - Produce la lista final de productos mediante signals + computed
// - Usa componentes “tontos” para UI: banner, filtros y grid
//
// Arquitectura:
// Este componente es el “smart component” del módulo Productos.
// Toda la lógica se concentra aquí. La UI se distribuye en componentes hijos.
// ============================================================================

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
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  // ============================================================
  // ESTADO: FILTRO SECUNDARIO
  //
  // Este filtro controla:
  // - categoría secundaria (cuando NO proviene del banner)
  // - orden
  // - condición del producto
  //
  // El banner y el filtro deben estar sincronizados.
  // ============================================================
  private _filter = signal<ProductFilter>({
    category: 'todos',
    sortBy: 'recent',
    condition: 'todos',
  });

  // Exponemos la versión readonly para los hijos
  filter = this._filter.asReadonly();

  // ============================================================
  // ESTADO: CATEGORÍA PRINCIPAL (banner)
  //
  // Valor manejado:
  // - 'guitarras'
  // - 'bajos'
  // - 'pedales'
  // - 'amplificadores'
  // - 'accesorios'
  // - 'otros'
  // - 'todos'
  // - null → sin categoría (pantalla /productos)
  // ============================================================
  bannerCategory = signal<ProductCategory | 'todos' | null>(null);

  // ============================================================
  // PRODUCTS: LISTA FILTRADA FINAL
  //
  // computed() recalcula:
  // 1) Aplica filtros secundarios del servicio
  // 2) Aplica la categoría principal del banner
  //
  // Resultado → ProductGridComponent lo renderiza.
  // ============================================================
  products = computed(() => {
    // Paso 1: aplicar filtros secundarios (servicio)
    let items = this.productService.filter(this._filter());

    // Paso 2: aplicar categoría del banner si existe
    const cat = this.bannerCategory();
    if (cat && cat !== 'todos') {
      items = items.filter(p => p.category === cat);
    }

    return items;
  });

  // ============================================================
  // CONSTRUCTOR: ESCUCHA CAMBIOS EN /productos/:slug
  //
  // Cuando la ruta incluye un slug:
  //   /productos/guitarras
  // entonces se sincroniza:
  //   - bannerCategory
  //   - filtro.category
  //
  // Si no viene slug → se limpian categoría principal y secundaria.
  // ============================================================
  constructor() {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug') as ProductCategory | 'todos' | null;

      if (slug && slug !== 'todos') {
        // Sincroniza banner y filtro
        this.bannerCategory.set(slug);
        this._filter.update(current => ({
          ...current,
          category: slug,
        }));
      } else {
        // Sin slug → página de “Todos los productos”
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

  // Cuando cambian los filtros secundarios (orden, condición...)
  onFilterChange(partial: Partial<ProductFilter>) {
    this._filter.update(current => ({ ...current, ...partial }));
  }

  // Cuando el usuario hace clic en una categoría del banner
  onBannerCategoryChange(cat: ProductCategory | 'todos' | null) {
    this.bannerCategory.set(cat);

    // Mantener sincronizado con el filtro secundario
    this._filter.update(current => ({
      ...current,
      category: cat ?? 'todos',
    }));
  }

  // Resetear TODOS los filtros y categoría principal
  onClearAll() {
    this._filter.set({
      category: 'todos',
      sortBy: 'recent',
      condition: 'todos',
    });

    this.bannerCategory.set(null);
  }
}
