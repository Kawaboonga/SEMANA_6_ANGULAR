
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

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
 * - Eliminar
 * - Alternar flags visuales (destacado, oferta, activo, etc.)
 *
 * El estado principal proviene de `ProductService`, que expone la lista
 * como signal reactive para usar directamente en el template.
 *
 * @usageNotes
 * - `productos()` siempre refleja el estado actual del servicio.
 * - `selectedProduct` define si el formulario está en modo crear o editar.
 * - Los cambios se aplican siempre mediante `productService.setAll()`.
 */
export class AdminProductos {

  // ============================================================
  // 1) Inyección de servicios
  // ============================================================

  /** Servicio centralizado de productos (mock local con signals). */
  private productService = inject(ProductService);

  // ============================================================
  // 2) State del componente
  // ============================================================

  /**
   * Lista de productos como signal readonly.
   * Ideal para usar directo en el HTML: productos().
   */
  productos = this.productService.products;

  /** Controla la visibilidad del panel del formulario. */
  showForm = false;

  /**
   * Producto actualmente seleccionado para edición.
   * - `null` → modo creación.
   * - `Product` → modo edición.
   */
  selectedProduct: Product | null = null;

  // ============================================================
  // 3) Acciones básicas (abrir form)
  // ============================================================

  /**
   * Abre el formulario en modo creación.
   * Resetea cualquier selección previa.
   */
  onCreate(): void {
    this.selectedProduct = null;
    this.showForm = true;
  }

  /**
   * Abre el formulario en modo edición con el producto seleccionado.
   * El formulario recibe el objeto tal cual.
   *
   * @param product Producto a editar
   */
  onEdit(product: Product): void {
    this.selectedProduct = product;
    this.showForm = true;
  }

  // ============================================================
  // 4) Eliminar producto
  // ============================================================

  /**
   * Confirma y elimina el producto del listado.
   *
   * @param product Producto a eliminar
   */
  onDelete(product: Product): void {
    if (!confirm(`¿Eliminar producto "${product.name}"?`)) return;

    const newList = this.productService
      .getAll()
      .filter((p) => p.id !== product.id);

    this.productService.setAll(newList);
  }

  // ============================================================
  // 5) Alternar flags del producto
  // ============================================================

  /**
   * Alterna un flag booleano del producto:
   * - showInCarousel
   * - isFeatured
   * - isOffer
   * - isNew
   * - isActive
   *
   * @param product Producto a modificar
   * @param flag Propiedad booleana a alternar
   */
  onToggleFlag(
    product: Product,
    flag: 'showInCarousel' | 'isFeatured' | 'isOffer' | 'isNew' | 'isActive',
  ): void {
    const list = this.productService.getAll();
    const idx = list.findIndex((p) => p.id === product.id);
    if (idx === -1) return;

    const updated: Product = {
      ...product,
      [flag]: !product[flag],
    };

    const newList = [...list];
    newList[idx] = updated;

    this.productService.setAll(newList);
  }

  // ============================================================
  // 6) Guardar producto (crear / actualizar)
  // ============================================================

  /**
   * Guarda los cambios enviados desde el formulario.
   * Maneja tanto creación como edición del producto.
   *
   * @param productFromForm Datos enviados por el formulario ya validados.
   */
  handleSave(productFromForm: Product): void {
    const list = this.productService.getAll();
    const idx = list.findIndex((p) => p.id === productFromForm.id);

    let newList: Product[];

    if (idx === -1) {
      // -----------------------------------------
      // MODO CREAR
      // -----------------------------------------
      const slug = productFromForm.slug || this.slugify(productFromForm.name);
      newList = [...list, { ...productFromForm, slug }];
    } else {
      // -----------------------------------------
      // MODO EDITAR
      // -----------------------------------------
      const existing = list[idx];

      const slug =
        productFromForm.slug ||
        existing.slug ||
        this.slugify(productFromForm.name);

      const merged: Product = {
        ...existing,
        ...productFromForm,
        slug,
      };

      newList = [...list];
      newList[idx] = merged;
    }

    this.productService.setAll(newList);
    this.showForm = false;
    this.selectedProduct = null;
  }

  /**
   * Acción del formulario para cancelar creación o edición.
   */
  handleCancel(): void {
    this.showForm = false;
    this.selectedProduct = null;
  }

  // ============================================================
  // 7) Helper: slugify
  // ============================================================

  /**
   * Convierte un nombre en un slug válido para URL:
   * - elimina acentos
   * - transforma a minúsculas
   * - reemplaza caracteres no alfanuméricos por guiones
   * - limpia guiones repetidos o al inicio/fin
   *
   * @param name Nombre del producto
   * @returns Slug limpio y seguro para rutas
   *
   * @example
   * slugify("Fender Stratocaster 2020") → "fender-stratocaster-2020"
   */
  private slugify(name: string): string {
    return name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
}
