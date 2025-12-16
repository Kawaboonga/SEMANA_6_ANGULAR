import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Product } from '@core/models/product.model';
import { ProductService } from '@core/services/product.service';
import { ProductFormComponent } from '@shared/forms/product-form/product-form';

@Component({
  selector: 'app-admin-preventas',
  standalone: true,
  imports: [CommonModule, ProductFormComponent],
  templateUrl: './admin-preventas.html',
  styleUrls: ['./admin-preventas.css'],
})
export class AdminPreventasComponent {
  private productService = inject(ProductService);

  // Preventas actuales
  products = computed(() => this.productService.getPreSales());

  // Estado del formulario
  showForm = signal(false);
  selectedProduct = signal<Product | null>(null);

  // Abrir formulario vacío (crear)
  onCreate(): void {
    this.selectedProduct.set(null);
    this.showForm.set(true);
  }

  // Editar una preventa existente
  onEdit(product: Product): void {
    this.selectedProduct.set(product);
    this.showForm.set(true);
  }

  // Cancelar formulario
  onCancelForm(): void {
    this.showForm.set(false);
    this.selectedProduct.set(null);
  }

  // Guardar (crear o actualizar)
  onSave(product: Product): void {
    if (!product.id) {
      // Alta de preventa
      this.productService.createPreSale(product);
    } else {
      // Aseguramos que sigue marcada como preventa
      this.productService.update({ ...product, isPreSale: true });
    }

    this.showForm.set(false);
    this.selectedProduct.set(null);
  }

  // Eliminar preventa
  onDelete(product: Product): void {
    const ok = confirm(`¿Eliminar la preventa "${product.name}"? Esta acción no se puede deshacer.`);
    if (!ok) return;

    this.productService.deleteById(product.id);
  }
}
