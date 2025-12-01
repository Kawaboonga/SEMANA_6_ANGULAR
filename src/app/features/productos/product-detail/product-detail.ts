// ============================================================================
// PRODUCT DETAIL COMPONENT
// Muestra la información completa de un producto individual.
// Se carga mediante la ruta /productos/:slug
// ============================================================================

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Product } from '@core/models/product.model';
import { ProductService } from '@core/services/product.service';
import { FadeUpDirective } from '@shared/directives/fade-up';

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
  private route = inject(ActivatedRoute);       // para obtener :slug desde la URL
  private productService = inject(ProductService); // acceso al catálogo

  // Producto que se mostrará en la vista
  product: Product | undefined;

  constructor() {
    // ============================================================
    // 1) LEER SLUG DESDE LA RUTA
    // ------------------------------------------------------------
    // snapshot = se usa porque no necesitamos reaccionar a cambios
    // dentro del mismo componente (no se navega entre productos
    // desde aquí, cada producto carga desde cero).
    // ============================================================
    const slug = this.route.snapshot.paramMap.get('slug');

    if (slug) {
      // ============================================================
      // 2) BUSCAR EL PRODUCTO EN EL SERVICIO
      // ------------------------------------------------------------
      // getBySlug() devuelve undefined si no existe.
      // ============================================================
      this.product = this.productService.getBySlug(slug);

      console.log('Detalle producto slug=', slug, '→', this.product);
    } else {
      // ============================================================
      // 3) SI NO EXISTE EL PARÁMETRO :slug
      // ------------------------------------------------------------
      // Esto solo debería pasar si la ruta está mal configurada.
      // ============================================================
      console.warn('No se encontró parámetro :slug en la ruta');
      this.product = undefined;
    }
  }
}
