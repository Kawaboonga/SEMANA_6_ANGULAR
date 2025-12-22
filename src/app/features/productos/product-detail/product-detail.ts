import { Component, computed,inject, signal, ViewChild,AfterViewInit,} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Product } from '@core/models/product.model';
import { ProductService } from '@core/services/product.service';
import { AuthService } from '@core/services/auth.service';

import { ProductFormComponent } from '@shared/forms/product-form/product-form';
import { FadeUpDirective } from '@shared/directives/fade-up';
import { ToastComponent } from '@shared/components/toast/toast.component';
import { AdminActionsPanelComponent } from '@shared/components/admin-actions-panel/admin-actions-panel';

/**
 * Componente de detalle de producto.
 *
 * Este componente:
 * - Lee el parámetro `slug` desde la URL.
 * - Recupera un producto usando ProductService.
 * - Muestra la información completa en el template (imagen, precio, specs, etc.).
 *
 * Mejora (Admin):
 * - Si el usuario es administrador, puede:
 *   - Editar el producto desde el detalle (reutiliza ProductFormComponent)
 *   - Eliminar el producto desde el detalle
 *
 * UX mejorado:
 * - Panel de acciones Admin reutilizable
 * - Formulario colapsable (toggle)
 * - Toast de confirmación al guardar o eliminar
 */
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ProductFormComponent,
    FadeUpDirective,
    ToastComponent,
    AdminActionsPanelComponent,
  ],
  templateUrl: './product-detail.html',
})
export class ProductDetailComponent implements AfterViewInit {
  // ============================================================
  // INYECCIÓN DE SERVICIOS
  // ============================================================

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private authService = inject(AuthService);

  // ============================================================
  // REFERENCIA A TOAST
  // ============================================================

  @ViewChild(ToastComponent) toast!: ToastComponent;

  // ============================================================
  // STATE PRINCIPAL
  // ============================================================

  product: Product | undefined;

  // ============================================================
  // ADMIN
  // ============================================================

  isAdmin = computed(() => this.authService.isAdmin());

  showForm = signal(false);
  selectedProduct = signal<Product | null>(null);

  // ============================================================
  // CONSTRUCTOR → carga inicial del producto
  // ============================================================

  constructor() {
    const slug = this.route.snapshot.paramMap.get('slug');

    if (slug) {
      this.product = this.productService.getBySlug(slug);
      console.log('[ProductDetail] slug=', slug, '→', this.product);
    } else {
      console.warn('[ProductDetail] No se encontró parámetro :slug en la ruta');
      this.product = undefined;
    }
  }

  // ============================================================
  // CICLO DE VIDA
  // ============================================================

  ngAfterViewInit(): void {
    // Debug útil: confirma que el toast está conectado
    console.log('[ProductDetail] Toast listo:', !!this.toast);
  }

  // ============================================================
  // ADMIN: ACCIONES DESDE EL DETALLE
  // ============================================================

  /**
   * Abre / cierra el formulario en modo editar (toggle).
   */
  onAdminEdit(): void {
    if (!this.isAdmin() || !this.product) return;

    this.showForm.update((v) => !v);

    if (this.showForm()) {
      this.selectedProduct.set({ ...this.product });
    } else {
      this.selectedProduct.set(null);
    }
  }

  /**
   * Elimina el producto actual (si es admin) y vuelve al listado.
   */
  onAdminDelete(): void {
    if (!this.isAdmin() || !this.product) return;

    const ok = confirm(
      `¿Eliminar el producto "${this.product.name}"?\nEsta acción no se puede deshacer.`,
    );
    if (!ok) return;

    this.productService.deleteById(this.product.id);

    // Mostrar toast ANTES de navegar
    this.toast.show('Producto eliminado correctamente');

    setTimeout(() => {
      this.router.navigate(['/productos']);
    }, 300);
  }

  /**
   * Guarda cambios desde el ProductFormComponent (update).
   */
  onAdminSave(product: Product): void {
    if (!this.isAdmin()) return;

    this.productService.update(product);
    this.product = product;

    this.showForm.set(false);
    this.selectedProduct.set(null);

    // ✅ Toast visible
    this.toast.show('Producto actualizado correctamente');
  }

  /**
   * Cancela edición.
   */
  onAdminCancel(): void {
    this.showForm.set(false);
    this.selectedProduct.set(null);
  }
}
