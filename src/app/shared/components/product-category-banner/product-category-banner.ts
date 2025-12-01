// ============================================================================
// PRODUCT CATEGORY BANNER COMPONENT
// ----------------------------------------------------------------------------
// Barra superior de categorías para filtrar productos (Guitarras, Bajos,
// Pedales, Amplificadores, Accesorios, Otros).
//
// - Se usa en la página de productos como filtro visual principal.
// - Maneja su propio estado de selección a través de @Input y @Output.
// - Soporta la categoría especial "todos" y el estado null (sin filtro).
// - Todas las claves están en plural para ser 100% consistentes con ProductCategory.
//
// Uso:
//   <app-product-category-banner
//        [activeCategory]="bannerCategory()"
//        (categoryChange)="onBannerCategoryChange($event)">
//   </app-product-category-banner>
//
// Este componente NO usa servicios ni lógica de negocio. Es “tonto”,
// totalmente presentacional. La lógica vive en ProductList.
// ============================================================================

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCategory } from '@core/models/product-category.model';

// Tipo público para el estado del banner
// - Puede ser una categoría real del producto
// - 'todos' para desactivar filtros
// - null para estado inicial
export type ProductBannerCategory = ProductCategory | 'todos' | null;

@Component({
  selector: 'app-product-category-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-category-banner.html',
  styleUrl: './product-category-banner.css',
})
export class ProductCategoryBannerComponent {

  // --------------------------------------------------------------------------
  // Input: categoría actualmente seleccionada (viene desde ProductList)
  // --------------------------------------------------------------------------
  @Input() activeCategory: ProductBannerCategory = null;

  // --------------------------------------------------------------------------
  // Output: emite la categoría seleccionada cuando el usuario hace click
  // --------------------------------------------------------------------------
  @Output() categoryChange = new EventEmitter<ProductBannerCategory>();


  // --------------------------------------------------------------------------
  // Categorías visibles en el banner (claves en plural)
  // --------------------------------------------------------------------------
  // Estas claves deben coincidir EXACTAMENTE con las del modelo ProductCategory,
  // ya que se filtra usando p.category === key.
  // --------------------------------------------------------------------------
  categories = [
    { key: 'guitarras',       label: 'Guitarras' },
    { key: 'bajos',           label: 'Bajos' },
    { key: 'pedales',         label: 'Pedales' },
    { key: 'amplificadores',  label: 'Amplificadores' },
    { key: 'accesorios',      label: 'Accesorios' },
    { key: 'otros',           label: 'Otros' },
  ] as const;


  // --------------------------------------------------------------------------
  // selectCategory(key)
  // --------------------------------------------------------------------------
  // Lógica mínima:
  // - Si se hace click en la categoría activa, se deselecciona → emit(null)
  // - Si se hace click en otra, se selecciona y se emite
  // --------------------------------------------------------------------------
  selectCategory(key: ProductCategory): void {
    if (this.activeCategory === key) {
      // Deseleccionar si se vuelve a hacer click en la misma categoría
      this.categoryChange.emit(null);
    } else {
      // Seleccionar una nueva categoría
      this.categoryChange.emit(key);
    }
  }
}
