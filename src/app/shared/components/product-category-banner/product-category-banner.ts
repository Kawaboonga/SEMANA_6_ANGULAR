// ============================================================================
// PRODUCT CATEGORY BANNER COMPONENT
// ----------------------------------------------------------------------------
// Componente de UI que muestra el banner superior con categorías:
//   Guitarras, Bajos, Pedales, Amplificadores, Accesorios, Otros.
//
// Su misión es exclusivamente visual:
//   - Mostrar categorías disponibles
//   - Marcar cuál está activa
//   - Emitir eventos cuando el usuario selecciona una categoría
//
// No contiene NINGUNA lógica de filtrado.  
// La lógica vive completamente en ProductListComponent.
//
// Uso recomendado:
//   <app-product-category-banner
//        [activeCategory]="bannerCategory()"
//        (categoryChange)="onBannerCategoryChange($event)">
//   </app-product-category-banner>
//
// ============================================================================

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCategory } from '@core/models/product-category.model';

/**
 * @typedef ProductBannerCategory
 * @description
 * Representa el estado global del filtro de categoría visual del banner.
 *
 * Puede ser:
 *  - una categoría real de productos (`ProductCategory`)
 *  - `'todos'` para mostrar todo el catálogo
 *  - `null` cuando no hay filtro activo (estado inicial)
 */
export type ProductBannerCategory = ProductCategory | 'todos' | null;

@Component({
  selector: 'app-product-category-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-category-banner.html',
  styleUrl: './product-category-banner.css',
})
export class ProductCategoryBannerComponent {

  // ==========================================================================
  // INPUT
  // ==========================================================================
  /**
   * @input activeCategory
   * @description
   * Categoría actualmente seleccionada en el banner.
   *
   * Este valor viene desde ProductListComponent (signal/bannerCategory).
   *
   * @example
   * <app-product-category-banner [activeCategory]="bannerCategory()">
   *
   * @usageNotes
   * Cuando es `null`, el banner muestra estado “sin filtro”.
   */
  @Input() activeCategory: ProductBannerCategory = null;


  // ==========================================================================
  // OUTPUT
  // ==========================================================================
  /**
   * @output categoryChange
   * @description
   * Emite la categoría seleccionada por el usuario.
   *
   * Puede emitir:
   *  - `'guitarras' | 'bajos' | …'` (categoría seleccionada)
   *  - `null` si el usuario hace click en la categoría ya activa → deselect
   *
   * @event
   * @example
   * (categoryChange)="onBannerCategoryChange($event)"
   */
  @Output() categoryChange = new EventEmitter<ProductBannerCategory>();


  // ==========================================================================
  // DATA: LISTADO DE CATEGORÍAS
  // ==========================================================================
  /**
   * @description
   * Arreglo con todas las categorías visibles del banner.
   *
   * Las claves (`key`) deben coincidir exactamente con `ProductCategory`,
   * ya que ProductListComponent filtra usando:
   *
   *   product.category === key
   */
  categories = [
    { key: 'guitarras',       label: 'Guitarras' },
    { key: 'bajos',           label: 'Bajos' },
    { key: 'pedales',         label: 'Pedales' },
    { key: 'amplificadores',  label: 'Amplificadores' },
    { key: 'accesorios',      label: 'Accesorios' },
    { key: 'otros',           label: 'Otros' },
  ] as const;


  // ==========================================================================
  // MÉTODO PRINCIPAL: selectCategory()
  // ==========================================================================
  /**
   * @method selectCategory
   * @description
   * Maneja la selección de una categoría desde la UI.
   *
   * Lógica:
   *  - Si la categoría clickeada YA está activa:
   *        → se deselecciona y se emite `null`
   *
   *  - Si la categoría es distinta:
   *        → se activa y se emite la nueva clave
   *
   * @param {ProductCategory} key - Categoría presionada por el usuario.
   *
   * @return void
   *
   * @example
   * // Usuario hace click en "bajos"
   * selectCategory('bajos') → categoryChange.emit('bajos')
   *
   * @example
   * // Usuario hace click nuevamente en "bajos"
   * selectCategory('bajos') → categoryChange.emit(null)
   *
   * @usageNotes
   * Este método NO muta nada internamente.
   * Toda la sincronización externa ocurre en ProductListComponent.
   */
  selectCategory(key: ProductCategory): void {
    if (this.activeCategory === key) {
      this.categoryChange.emit(null);       // Deseleccionar
    } else {
      this.categoryChange.emit(key);        // Activar nueva categoría
    }
  }
}
