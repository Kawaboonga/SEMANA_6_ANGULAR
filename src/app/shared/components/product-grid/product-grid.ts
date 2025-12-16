// ============================================================================
// PRODUCT GRID COMPONENT
// ----------------------------------------------------------------------------
// Componente presentacional ("dumb component") encargado únicamente de mostrar
// un grid de tarjetas de productos.
//
// - NO contiene lógica de filtrado, orden ni búsqueda.
// - Solo recibe un array de productos desde ProductListComponent.
// - Renderiza <app-product-card> por cada producto.
// - Opcionalmente puede mostrar acciones de administración (editar/eliminar)
//   si se le pasa [canEdit]="true" desde el componente padre.
//
// Este patrón mantiene clara la arquitectura:
//   • ProductListComponent = componente inteligente (smart)
//   • ProductGridComponent = componente visual (dumb)
// ============================================================================

import { Component, Input, Output, EventEmitter } from '@angular/core';
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
 * Si el usuario actual es administrador y quieres mostrar acciones de edición
 * y eliminación en las tarjetas:
 *
 * ```html
 * <app-product-grid
 *   [products]="products()"
 *   [canEdit]="isAdmin()"
 *   (editRequest)="onAdminEdit($event)"
 *   (deleteRequest)="onAdminDelete($event)">
 * </app-product-grid>
 * ```
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
   */
  @Input() products: Product[] = [];

  /**
   * Indica si las tarjetas deben mostrar acciones de administración
   * (botones Editar / Eliminar).
   *
   * Normalmente se enlaza a algo como `isAdmin()` en el componente padre.
   *
   * @default false
   */
  @Input() canEdit = false;

  /**
   * Evento emitido cuando una tarjeta solicita editar un producto.
   *
   * El payload es el `id` del producto.
   *
   * @example
   * (editRequest)="onAdminEdit($event)"
   */
  @Output() editRequest = new EventEmitter<string>();

  /**
   * Evento emitido cuando una tarjeta solicita eliminar un producto.
   *
   * El payload es el `id` del producto.
   *
   * @example
   * (deleteRequest)="onAdminDelete($event)"
   */
  @Output() deleteRequest = new EventEmitter<string>();

  /**
   * Re-emite el id del producto cuando una card dispara su propio
   * evento de edición.
   */
  onEditFromCard(productId: string): void {
    this.editRequest.emit(productId);
  }

  /**
   * Re-emite el id del producto cuando una card dispara su propio
   * evento de eliminación.
   */
  onDeleteFromCard(productId: string): void {
    this.deleteRequest.emit(productId);
  }
}
