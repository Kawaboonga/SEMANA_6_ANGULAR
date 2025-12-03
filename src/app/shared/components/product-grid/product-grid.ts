// ============================================================================
// PRODUCT GRID COMPONENT
// ----------------------------------------------------------------------------
// Componente presentacional ("dumb component") encargado únicamente de mostrar
// un grid de tarjetas de productos.
//
// - NO contiene lógica de filtrado, orden ni búsqueda.
// - Solo recibe un array de productos desde ProductListComponent.
// - Renderiza <app-product-card> por cada producto.
//
// Este patrón mantiene clara la arquitectura:
//   • ProductListComponent = componente inteligente (smart)
//   • ProductGridComponent = componente visual (dumb)
// ============================================================================

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Product } from '@core/models/product.model';
import { ProductCardComponent } from '@shared/components/product-card/product-card';

/**
 * @component ProductGridComponent
 *
 * @description
 * Componente visual encargado exclusivamente de renderizar un **grid** de
 * productos usando `<app-product-card>` para cada item.  
 *
 * Este componente **no contiene lógica** de filtrado ni ordenamiento:
 * recibe un arreglo de productos *ya procesado* desde el componente padre
 * (`ProductListComponent`), lo cual mantiene la arquitectura limpia y escalable.
 *
 * @usageNotes
 * Úsalo siempre como un componente presentacional:
 *
 * ```html
 * <app-product-grid [products]="products()"></app-product-grid>
 * ```
 *
 * Aquí `products()` es un computed o arreglo calculado en
 * `ProductListComponent`.
 *
 * @example
 * <!-- Con lista estática -->
 * <app-product-grid [products]="[{ id:'p1', name:'Guitarra', ... }]">
 * </app-product-grid>
 *
 * @example
 * <!-- Dentro de ProductListComponent -->
 * <app-product-grid [products]="filteredProducts"></app-product-grid>
 */
@Component({
  selector: 'app-product-grid',
  standalone: true,

  // Módulos necesarios:
  // - CommonModule → directivas estructurales como *ngIf y *ngFor
  // - ProductCardComponent → tarjeta individual para mostrar el producto
  imports: [CommonModule, ProductCardComponent],

  templateUrl: './product-grid.html',
})
export class ProductGridComponent {

  /**
   * Lista de productos a mostrar en el grid.
   *
   * @description
   * El componente no realiza ningún proceso sobre este arreglo.
   * Cada elemento se envía directamente a `<app-product-card>`.
   *
   * @param products Arreglo de `Product` ya filtrados y ordenados.
   * @default []
   *
   * @example
   * <app-product-grid [products]="myFilteredProducts"></app-product-grid>
   */
  @Input() products: Product[] = [];
}
