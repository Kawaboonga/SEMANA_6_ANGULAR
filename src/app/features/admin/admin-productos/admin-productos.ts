import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Product } from '@core/models/product.model';
import { ProductService } from '@core/services/product.service';
import { ProductFormComponent } from '@shared/forms/product-form/product-form';

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [CommonModule, ProductFormComponent],
  templateUrl: './admin-productos.html',
  styleUrls: ['./admin-productos.css'],
})
/**
 * Panel de administración de productos.
 *
 * Este componente permite gestionar el ciclo completo de un producto:
 * - Crear nuevos productos
 * - Editar productos ya existentes
 * - Eliminar productos
 * - Alternar flags visuales (destacado, oferta, activo, etc.)
 *
 * El estado principal proviene de `ProductService`, que expone la lista
 * como signal reactivo para usar directamente en el template.
 *
 * @usageNotes
 * - `productos()` siempre refleja el estado actual del servicio.
 * - `selectedProduct()` define si el formulario está en modo crear o editar.
 * - Los cambios se aplican siempre mediante los métodos del servicio
 *   (`create`, `update`, `deleteById`, `toggleFlag`).
 */
export class AdminProductos {
  // ============================================================
  // 1) Inyección de servicios
  // ============================================================

  /** Servicio centralizado de productos (JSON remoto + localStorage + signals). */
  private readonly productService = inject(ProductService);

  /** ActivatedRoute → usado para abrir edición directa desde queryParam ?id= */
  private readonly route = inject(ActivatedRoute);

  // ============================================================
  // 2) State del componente
  // ============================================================

  /**
   * Lista de productos como computed, directo desde el servicio.
   * Ideal para usar en el HTML con productos().
   */
  productos = computed(() => this.productService.getAll());

  /** Controla la visibilidad del panel del formulario. */
  showForm = signal(false);

  /**
   * Producto actualmente seleccionado para edición.
   * - `null` → modo creación.
   * - `Product` → modo edición.
   */
  selectedProduct = signal<Product | null>(null);

  // ============================================================
  // 3) Constructor → abrir edición desde queryParam (opcional)
  // ============================================================

  constructor() {
    const idFromQuery = this.route.snapshot.queryParamMap.get('id');
    if (idFromQuery) {
      const found = this.productService.getAll().find(p => p.id === idFromQuery);
      if (found) {
        this.onEdit(found);
      }
    }
  }

  // ============================================================
  // 4) Acciones básicas (abrir form)
  // ============================================================

  /**
   * Abre el formulario en modo creación.
   * Resetea cualquier selección previa.
   */
  onCreate(): void {
    this.selectedProduct.set(null);
    this.showForm.set(true);
  }

  /**
   * Abre el formulario en modo edición con el producto seleccionado.
   *
   * @param product Producto a editar
   */
  onEdit(product: Product): void {
    this.selectedProduct.set(product);
    this.showForm.set(true);
  }

  // ============================================================
  // 5) Eliminar producto
  // ============================================================

  /**
   * Confirma y elimina el producto del listado usando ProductService.
   *
   * @param product Producto a eliminar
   */
  onDelete(product: Product): void {
    const ok = confirm(
      `¿Eliminar producto "${product.name}"?\nEsta acción no se puede deshacer.`
    );
    if (!ok) return;

    this.productService.deleteById(product.id);
  }

  // ============================================================
  // 6) Alternar flags del producto
  // ============================================================

  /**
   * Alterna un flag booleano del producto:
   * - showInCarousel
   * - isFeatured
   * - isOffer
   * - isNew
   * - isActive
   *
   * (Si quieres manejar preventas desde aquí, puedes agregar 'isPreSale').
   *
   * @param product Producto a modificar
   * @param flag Propiedad booleana a alternar
   */
  onToggleFlag(
    product: Product,
    flag: 'showInCarousel' | 'isFeatured' | 'isOffer' | 'isNew' | 'isActive',
  ): void {
    this.productService.toggleFlag(product.id, flag);
  }

  // ============================================================
  // 7) Guardar producto (crear / actualizar)
  // ============================================================

  /**
   * Guarda los cambios enviados desde el formulario.
   * Maneja tanto creación como edición del producto.
   *
   * @param productFromForm Datos enviados por el formulario ya validados.
   */
  handleSave(productFromForm: Product): void {
    // Si no viene id → creación
    if (!productFromForm.id) {
      // Eliminamos id por seguridad y delegamos al servicio
      const { id: _, ...data } = productFromForm;
      this.productService.create(data);
    } else {
      // Edición → delegamos en el servicio
      this.productService.update(productFromForm);
    }

    this.showForm.set(false);
    this.selectedProduct.set(null);
  }

  /**
   * Acción del formulario para cancelar creación o edición.
   */
  handleCancel(): void {
    this.showForm.set(false);
    this.selectedProduct.set(null);
  }
}
