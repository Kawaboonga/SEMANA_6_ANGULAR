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
//   • (Opcional) Botones de administración (Editar / Eliminar) cuando
//     el contenedor así lo solicite.
//
// Este componente es completamente "dumb":
//   - No filtra.
//   - No ordena.
//   - No usa servicios.
//   Solo pinta los datos que se le entregan y emite eventos simples.
// ============================================================================

import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  // FALLBACK IMAGEN (URL PÚBLICA)
  // ==========================================================================
  /**
   * @property FALLBACK_IMAGE_URL
   * @description
   * Imagen de relleno (placeholder) usada cuando:
   *  - product.imageUrl viene vacío/null/undefined
   *  - la imagen falla al cargar (404, CORS, etc.)
   *
   * Nota:
   * - Se usa URL pública (requerimiento del proyecto).
   */
  readonly FALLBACK_IMAGE_URL =
    'https://polarvectors.com/wp-content/uploads/2023/06/Guitar-SVG.jpg';

  /**
   * @property imageSrc
   * @description
   * Fuente final de la imagen para renderizar en la vista.
   *
   * Importante:
   * - Evita usar `.trim()` directo en el template porque si imageUrl
   *   no es string (data sucia desde JSON/localStorage) revienta la vista.
   */
  get imageSrc(): string {
    const raw = (this.product?.imageUrl ?? '').toString().trim();
    return raw.length > 0 ? raw : this.FALLBACK_IMAGE_URL;
  }

  /**
   * @method onImgError
   * @description
   * Handler para el evento (error) del <img>.
   * Si la URL de imagen falla, reemplaza por el placeholder.
   *
   * @usageNotes
   * Evitamos un loop infinito verificando que no estemos ya
   * usando la imagen fallback.
   */
  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img.src === this.FALLBACK_IMAGE_URL) return;
    img.src = this.FALLBACK_IMAGE_URL;
  }

  // ==========================================================================
  // MODO ADMIN → BOTONES EDITAR / ELIMINAR
  // ==========================================================================
  @Input() canEdit = false;

  @Output() editRequest = new EventEmitter<string>();
  @Output() deleteRequest = new EventEmitter<string>();

  onEditClick(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    this.editRequest.emit(this.product.id);
  }

  onDeleteClick(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();

    const ok = confirm(
      `¿Eliminar el producto "${this.product.name}"?\n` +
        'Esta acción no se puede deshacer.',
    );

    if (!ok) return;

    this.deleteRequest.emit(this.product.id);
  }

  // ==========================================================================
  // DESCUENTO → BADGE "-20%"
  // ==========================================================================
  get hasDiscount(): boolean {
    return !!(
      this.product.previousPrice &&
      this.product.previousPrice > this.product.price
    );
  }

  get discountPercent(): number {
    if (!this.hasDiscount) return 0;

    const prev = this.product.previousPrice!;
    const percent = 1 - this.product.price / prev;

    return Math.round(percent * 100);
  }

  // ==========================================================================
  // RESUMEN DESCRIPTIVO
  // ==========================================================================
  getSummary(product: Product): string {
    const text = product.shortDescription || product.description || '';
    const maxLength = 90;

    if (text.length <= maxLength) {
      return text;
    }

    return text.substring(0, maxLength).trim() + '…';
  }
}
