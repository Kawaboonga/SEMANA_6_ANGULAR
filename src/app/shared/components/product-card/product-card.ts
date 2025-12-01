// ============================================================================
// PRODUCT CARD COMPONENT
// ----------------------------------------------------------------------------
// Tarjeta reutilizable para mostrar un producto individual.
// Usado en:
//   - Grid de productos
//   - Carruseles del home
//   - Listados filtrados
//
// Características:
//   - Soporta precio actual + precio anterior (para ofertas).
//   - Calcula automáticamente si existe descuento.
//   - Muestra el porcentaje de rebaja.
//   - Genera un resumen corto (shortDescription / description).
//
// Entrada principal:
//   @Input() product: Product
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
  // INPUT
  // ==========================================================================
  /** Producto a renderizar en la card (obligatorio). */
  @Input({ required: true }) product!: Product;


  // ==========================================================================
  // DESCUENTO
  // --------------------------------------------------------------------------
  // - Existe descuento si:
  //      previousPrice > price
  // - Se usa para mostrar badge tipo "-20%"
  // ==========================================================================
  
  /** ¿El producto tiene precio anterior mayor al actual? */
  get hasDiscount(): boolean {
    return !!(
      this.product.previousPrice &&
      this.product.previousPrice > this.product.price
    );
  }

  /** Porcentaje de descuento redondeado (ej: 20, 35, 50). */
  get discountPercent(): number {
    if (!this.hasDiscount) return 0;

    const prev = this.product.previousPrice!;
    const percent = 1 - this.product.price / prev;

    return Math.round(percent * 100);
  }


  // ==========================================================================
  // RESUMEN / DESCRIPCIÓN CORTA
  // --------------------------------------------------------------------------
  // - Usa shortDescription si existe.
  // - Si no, cae en description.
  // - Limita longitud para mantener simetría entre cards.
  // ==========================================================================
  
  /**
   * Devuelve un resumen corto del producto:
   *    - Elige entre shortDescription o description.
   *    - Limita a ~90 caracteres.
   *    - Agrega "…" si es necesario.
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
