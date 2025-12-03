// ============================================================================
// PRODUCT CARD COMPONENT
// ----------------------------------------------------------------------------
// Tarjeta reutilizable para mostrar un producto individual.
// Usado en:
//   • Grid de productos
//   • Carruseles del home
//   • Listados filtrados (ProductListComponent)
//
// Características:
//   • Precio actual + precio anterior (ofertas).
//   • Cálculo automático del porcentaje de rebaja.
//   • Resumen corto basado en shortDescription/description.
//   • Standalone + RouterLink.
//
// Este componente es completamente "dumb":
//   - No filtra.
//   - No ordena.
//   - No usa servicios.
//   Solo pinta los datos que se le entregan.
// ============================================================================

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Product } from '@core/models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCardComponent {

  // ==========================================================================
  // INPUT PRINCIPAL
  // ==========================================================================
  /**
   * @property product
   * @description
   * Producto que será renderizado por la tarjeta.
   *
   * Este input es obligatorio y debe contener un objeto `Product`
   * completo, proveniente normalmente de ProductGridComponent.
   *
   * @usageNotes
   * El componente NO valida que el producto exista.
   * Esa responsabilidad es del contenedor que haga el render.
   *
   * @example
   * <app-product-card [product]="item"></app-product-card>
   */
  @Input({ required: true }) product!: Product;


  // ==========================================================================
  // DESCUENTO → BADGE "-20%"
  // ==========================================================================
  /**
   * @property hasDiscount
   * @description
   * Indica si el producto tiene un descuento activo.
   * Un producto está en oferta cuando:
   *
   *   previousPrice > price
   *
   * @return {boolean} true si existe precio anterior mayor al actual.
   *
   * @example
   * if (hasDiscount) { mostrarBadge() }
   */
  get hasDiscount(): boolean {
    return !!(
      this.product.previousPrice &&
      this.product.previousPrice > this.product.price
    );
  }

  /**
   * @property discountPercent
   * @description
   * Calcula el porcentaje de descuento basado en:
   *
   *   (1 - price / previousPrice) * 100
   *
   * Redondea al número entero más cercano.
   *
   * @return {number} porcentaje entero (ej: 25).
   *
   * @example
   * // price=75, previousPrice=100 → 25
   * card.discountPercent  // 25
   *
   * @usageNotes
   * Si no hay descuento, devuelve 0.
   */
  get discountPercent(): number {
    if (!this.hasDiscount) return 0;

    const prev = this.product.previousPrice!;
    const percent = 1 - this.product.price / prev;

    return Math.round(percent * 100);
  }


  // ==========================================================================
  // RESUMEN DESCRIPTIVO
  // ==========================================================================
  /**
   * @method getSummary
   * @description
   * Construye una descripción corta del producto.
   *
   * Regla:
   *   • Si existe `shortDescription`, se usa esa.
   *   • Si no, se cae en `description`.
   *   • Se limita a ~90 caracteres para mantener
   *     consistencia visual en el grid.
   *
   * @param {Product} product - Instancia de producto cuyo resumen se generará.
   * @return {string} texto final recortado o completo según longitud.
   *
   * @example
   * getSummary(product)
   * // "Guitarra Fender Stratocaster ideal para rock y blues…"
   *
   * @usageNotes
   * Este método solo afecta a la vista de la card.
   * No modifica el modelo original.
   */
  getSummary(product: Product): string {
    const text = product.shortDescription || product.description || '';
    const maxLength = 90;

    if (text.length <= maxLength) {
      return text;
    }

    return text.substring(0, maxLength).trim() + '…';
  }
}
