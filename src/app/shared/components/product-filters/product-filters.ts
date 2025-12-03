// ============================================================================
// PRODUCT FILTERS COMPONENT
// ----------------------------------------------------------------------------
// Barra de filtros secundaria para la vista de productos.
// Incluye:
//  - Búsqueda por texto
//  - Filtrar por categoría secundaria
//  - Filtrar por condición (nuevo / usado / todos)
//  - Ordenar por precio o fecha
//  - Reset general de filtros
//
// IMPORTANTE:
// Este componente es completamente "dumb":
//    ✔ No filtra
//    ✔ No ordena
//    ✔ No decide nada por sí mismo
//    ✔ Solo emite eventos hacia ProductListComponent
//
// Toda la lógica real ocurre en ProductListComponent, donde
// los signals y computed recalculan la lista final de productos.
// ============================================================================

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductFilter } from '@core/models/product-filter.model';

/**
 * @component ProductFiltersComponent
 *
 * @description
 * Componente presentacional que muestra la **barra de filtros secundaria**
 * del módulo Productos.  
 *
 * Su responsabilidad es únicamente **emitir cambios** cuando el usuario actualiza:
 * - búsqueda por texto  
 * - categoría  
 * - condición (nuevo/usado)  
 * - orden  
 *
 * El componente NO procesa ni modifica productos.  
 * Toda la lógica se delega al componente padre mediante events.
 *
 * @usageNotes
 * Úsalo siempre junto a `<app-product-grid>` dentro de `ProductListComponent`.
 *
 * ```html
 * <app-product-filters
 *   [filter]="filter()"
 *   (filterChange)="onFilterChange($event)"
 *   (clearAll)="onClearAll()"
 * ></app-product-filters>
 * ```
 *
 * @example
 * // Emisión de cambios:
 * onCategoryChange('guitarras') → { category: 'guitarras' }
 *
 * @example
 * // Reseteo:
 * onClear() → clearAll.emit()
 */
@Component({
  selector: 'app-product-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-filters.html',
  styleUrl: './product-filters.css',
})
export class ProductFiltersComponent {

  // ==========================================================================
  // INPUT: ESTADO DEL FILTRO
  // ==========================================================================
  /**
   * Estado actual del filtro proveniente del componente padre.
   *
   * @description
   * El componente recibe siempre un `ProductFilter` válido desde
   * ProductListComponent.  
   * Este filtro se usa solo para mostrar valores actuales en los select y
   * el input de búsqueda.  
   *
   * @param filter Objeto de tipo `ProductFilter` con el estado actual.
   *
   * @example
   * <app-product-filters [filter]="filter()"></app-product-filters>
   */
  @Input({ required: true }) filter!: ProductFilter;


  // ==========================================================================
  // OUTPUTS: EVENTOS EMITIDOS AL PADRE
  // ==========================================================================
  /**
   * Evento que emite **cambios parciales** del filtro.
   *
   * @description
   * Cada cambio emite solo el fragmento que debe actualizarse:
   *
   * ```ts
   * { searchTerm: 'stratocaster' }
   * { category: 'guitarras' }
   * { sortBy: 'price-asc' }
   * ```
   *
   * ProductListComponent actualiza el signal interno con estos fragmentos.
   */
  @Output() filterChange = new EventEmitter<Partial<ProductFilter>>();

  /**
   * Evento que indica un **reset total** de los filtros secundarios.
   *
   * @example
   * this.clearAll.emit();
   */
  @Output() clearAll = new EventEmitter<void>();


  // ==========================================================================
  // MÉTODOS PARA EMITIR CAMBIOS INDIVIDUALES
  // ==========================================================================
  /**
   * @description Emite término de búsqueda hacia ProductListComponent.
   * @param term Texto ingresado por el usuario.
   * @example onSearch('guitarra stratocaster')
   */
  onSearch(term: string) {
    this.filterChange.emit({ searchTerm: term });
  }

  /**
   * @description Cambia la categoría secundaria.
   * @param category Nueva categoría seleccionada.
   * @example onCategoryChange('bajos')
   */
  onCategoryChange(category: ProductFilter['category']) {
    this.filterChange.emit({ category });
  }

  /**
   * @description Cambia condición del producto (nuevo/usado/todos).
   * @param condition 'nuevo' | 'usado' | 'todos'
   * @example onConditionChange('nuevo')
   */
  onConditionChange(condition: ProductFilter['condition']) {
    this.filterChange.emit({ condition });
  }

  /**
   * @description Cambia el método de ordenamiento.
   * @param sortBy Criterio de orden: 'recent', 'price-asc', 'price-desc', etc.
   * @example onSortChange('price-desc')
   */
  onSortChange(sortBy: ProductFilter['sortBy']) {
    this.filterChange.emit({ sortBy });
  }

  /**
   * @description Limpia absolutamente todos los filtros secundarios.
   * @example onClear()
   */
  onClear() {
    this.clearAll.emit();
  }
}
