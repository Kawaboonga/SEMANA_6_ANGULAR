
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Product } from '@core/models/product.model';
import { ProductService } from '@core/services/product.service';
import { FadeUpDirective } from '@shared/directives/fade-up';

/**
 * Componente de detalle de producto.
 *
 * Este componente:
 * - Lee el parámetro `slug` desde la URL.
 * - Recupera un producto usando ProductService.
 * - Muestra la información completa en el template (imagen, precio, specs, etc.).
 *
 * @usageNotes
 * - La navegación es estática: si el usuario navega entre productos desde enlaces
 *   externos, Angular recrea el componente → por eso se usa snapshot en vez de
 *   paramMap.subscribe().
 * - Si el slug es inválido, `product` queda undefined y se espera que el template
 *   o el router manejen la redirección a NotFound.
 *
 * @example
 * // ruta configurada en productos.routes.ts
 * {
 *   path: ':slug',
 *   loadComponent: () => import('./product-detail').then(m => m.ProductDetailComponent)
 * }
 */
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FadeUpDirective],
  templateUrl: './product-detail.html',
})
export class ProductDetailComponent {

  // ============================================================
  // INYECCIÓN DE SERVICIOS
  // ============================================================

  /** Acceso al parámetro `:slug` desde la URL */
  private route = inject(ActivatedRoute);

  /** Servicio centralizado del catálogo de productos */
  private productService = inject(ProductService);

  // ============================================================
  // STATE PRINCIPAL
  // ============================================================

  /**
   * Producto encontrado según slug.
   * Si no se encuentra, queda como `undefined`.
   */
  product: Product | undefined;

  // ============================================================
  // CONSTRUCTOR → carga inicial del producto
  // ============================================================

  constructor() {
    /**
     * 1) LEER EL SLUG DESDE LA RUTA
     *
     * Se usa snapshot:
     * - Este componente no requiere reaccionar a cambios
     * - Cada navegación a /productos/:slug crea un componente nuevo
     */
    const slug = this.route.snapshot.paramMap.get('slug');

    if (slug) {
      /**
       * 2) BUSCAR EL PRODUCTO EN EL SERVICIO
       *
       * @returns Product | undefined
       *
       * - getBySlug devuelve undefined si no existe
       * - El template puede detectar undefined y mostrar “Producto no encontrado”
       *   o navegar a una página 404.
       */
      this.product = this.productService.getBySlug(slug);

      console.log('Detalle producto slug=', slug, '→', this.product);
    } else {
      /**
       * 3) SI LA RUTA NO CONTIENE SLUG
       *
       * Esto en la práctica solo ocurre si la ruta está mal configurada.
       */
      console.warn('[ProductDetail] No se encontró parámetro :slug en la ruta');
      this.product = undefined;
    }
  }
}
