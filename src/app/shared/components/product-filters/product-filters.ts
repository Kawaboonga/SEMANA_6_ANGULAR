// ============================================================================
// PRODUCT FILTERS COMPONENT
// ----------------------------------------------------------------------------
// Barra de filtros secundaria para la vista de productos.
// Incluye:
//  - Búsqueda por texto
//  - Filtrar por categoría
//  - Filtrar por condición (nuevo/usado)
//  - Ordenar por precio o fecha
//  - Reset general de filtros
//
// Funciona de manera reactiva usando:
//  - @Input() filter → estado actual
//  - @Output() filterChange → emite cambios parciales
//  - @Output() clearAll → limpia todo
//
// NOTA:
//
// Este componente NO maneja la lógica de filtrado real.
// Solo emite eventos y ProductListComponent se encarga
// de actualizar el signal y recalcular los productos.
//
// ============================================================================

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductFilter } from '@core/models/product-filter.model';

@Component({
  selector: 'app-product-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-filters.html',
  styleUrl: './product-filters.css',
})
export class ProductFiltersComponent {

  // --------------------------------------------------------------------------
  // Estado actual de los filtros
  // Recibido desde el padre → ProductListComponent
  // --------------------------------------------------------------------------
  @Input({ required: true }) filter!: ProductFilter;

  // --------------------------------------------------------------------------
  // Eventos emitidos hacia el componente padre
  // --------------------------------------------------------------------------

  /** Emite cambios parciales del filtro, ej:
      { category: 'guitarras' }, { sortBy: 'price-desc' }, etc. */
  @Output() filterChange = new EventEmitter<Partial<ProductFilter>>();

  /** Limpia absolutamente todos los filtros secundarios. */
  @Output() clearAll = new EventEmitter<void>();


  // --------------------------------------------------------------------------
  // Métodos de actualización: cada uno emite SOLO lo necesario.
  // --------------------------------------------------------------------------

  /** Filtro por texto (searchTerm). */
  onSearch(term: string) {
    this.filterChange.emit({ searchTerm: term });
  }

  /** Cambio de categoría secundaria (no banner). */
  onCategoryChange(category: ProductFilter['category']) {
    this.filterChange.emit({ category });
  }

  /** Cambio de condición del producto: nuevo / usado / todos. */
  onConditionChange(condition: ProductFilter['condition']) {
    this.filterChange.emit({ condition });
  }

  /** Ordenamiento seleccionado: reciente, precio asc/desc, etc. */
  onSortChange(sortBy: ProductFilter['sortBy']) {
    this.filterChange.emit({ sortBy });
  }

  /** Botón “Limpiar todos los filtros”. */
  onClear() {
    this.clearAll.emit();
  }
}
