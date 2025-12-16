import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductService } from '@core/services/product.service';
import { ProductGridComponent } from '@shared/components/product-grid/product-grid';
import { FadeUpDirective } from '@shared/directives/fade-up';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-preventas-list',
  standalone: true,
  imports: [CommonModule, ProductGridComponent, FadeUpDirective],
  templateUrl: './preventas-list.html',
})
export class PreventasListComponent {
  private productService = inject(ProductService);
  private authService = inject(AuthService);

  // Solo preventas activas
  products = computed(() => this.productService.getPreSales());

  isAdmin = computed(() => this.authService.isAdmin());

  // Handlers para admin desde las cards
  onEdit(productId: string) {
    // Aquí puedes navegar al admin o abrir un formulario, según tu UX.
    // Por ejemplo:
    // this.router.navigate(['/admin/productos'], { queryParams: { id: productId } });
  }

  onDelete(productId: string) {
    this.productService.deleteById(productId);
  }
}
