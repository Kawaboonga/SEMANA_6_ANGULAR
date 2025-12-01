// src/app/features/admin/productos/admin-productos.component.ts

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
export class AdminProductos {
  // ============================================================
  // 1) Inyección de servicios
  // ============================================================
  // Servicio centralizado de productos (mock local).
  // Expone un signal con la lista y métodos para actualizarla.
  private productService = inject(ProductService);

  // ============================================================
  // 2) State del componente
  // ============================================================
  // Signal de solo lectura con el listado de productos,
  // ideal para usar directo en el template: productos().
  productos = this.productService.products;

  // Control del panel lateral / card del formulario.
  showForm = false;

  // Producto seleccionado para edición.
  // Si es null → el formulario trabaja en modo "crear".
  selectedProduct: Product | null = null;

  // ============================================================
  // 3) Acciones básicas (abrir form en modo crear/editar)
  // ============================================================

  // Abrir el formulario en modo "nuevo producto".
  onCreate(): void {
    this.selectedProduct = null;
    this.showForm = true;
  }

  // Abrir el formulario en modo edición.
  // Se pasa el producto tal cual al form (mismo objeto).
  onEdit(product: Product): void {
    this.selectedProduct = product;
    this.showForm = true;
  }

  // ============================================================
  // 4) Eliminar producto
  // ============================================================

  // Confirma y elimina un producto desde el listado general.
  onDelete(product: Product): void {
    if (!confirm(`¿Eliminar producto "${product.name}"?`)) return;

    const list = this.productService.getAll();
    const newList = list.filter((p) => p.id !== product.id);

    // Actualiza el signal del servicio con la lista filtrada.
    this.productService.setAll(newList);
  }

  // ============================================================
  // 5) Alternar flags de visibilidad/estado
  // ============================================================
  // Cambia el valor booleano de una de estas propiedades:
  // showInCarousel, isFeatured, isOffer, isNew, isActive.
  onToggleFlag(
    product: Product,
    flag: 'showInCarousel' | 'isFeatured' | 'isOffer' | 'isNew' | 'isActive',
  ): void {
    const list = this.productService.getAll();
    const idx = list.findIndex((p) => p.id === product.id);
    if (idx === -1) return;

    // Crea una copia del producto con el flag invertido.
    const updated: Product = {
      ...product,
      [flag]: !product[flag],
    };

    // Reemplaza el producto en la posición original.
    const newList = [...list];
    newList[idx] = updated;

    // Persistimos la nueva lista en el servicio.
    this.productService.setAll(newList);
  }

  // ============================================================
  // 6) Guardar producto (crear o actualizar)
  // ============================================================
  // Recibe el producto desde el formulario ya validado.
  handleSave(productFromForm: Product): void {
    const list = this.productService.getAll();
    const idx = list.findIndex((p) => p.id === productFromForm.id);

    let newList: Product[];

    if (idx === -1) {
      // MODO CREAR → el producto no existe en la lista.
      // Si no viene slug, se genera uno a partir del nombre.
      const slug = productFromForm.slug || this.slugify(productFromForm.name);

      newList = [...list, { ...productFromForm, slug }];
    } else {
      // MODO EDITAR → ya existe un producto con ese id.
      const existing = list[idx];

      // Mantener slug existente si ya estaba definido.
      const slug =
        productFromForm.slug ||
        existing.slug ||
        this.slugify(productFromForm.name);

      // Mezcla de datos:
      // - primero el existente (para no perder campos que no aparecen en el form)
      // - luego el payload del form (lo más reciente)
      const merged: Product = {
        ...existing,        // estado previo (shortDescription, tags, rating, etc.)
        ...productFromForm, // datos editados en el formulario (precio, flags, etc.)
        slug,
      };

      newList = [...list];
      newList[idx] = merged;
    }

    // Se actualiza la lista completa en el servicio.
    this.productService.setAll(newList);

    // Cierra el formulario y limpia la selección.
    this.showForm = false;
    this.selectedProduct = null;
  }

  // Botón "Cancelar" del formulario → vuelve al listado.
  handleCancel(): void {
    this.showForm = false;
    this.selectedProduct = null;
  }

  // ============================================================
  // 7) Helper para generar slugs
  // ============================================================
  // Convierte el nombre del producto en un slug URL-friendly:
  // - elimina acentos
  // - pasa a minúsculas
  // - reemplaza espacios y caracteres raros por guiones
  private slugify(name: string): string {
    return name
      .normalize('NFD')                  // separa acentos
      .replace(/[\u0300-\u036f]/g, '')   // elimina marcas diacríticas
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')       // reemplaza lo que no es alfanumérico por guiones
      .replace(/(^-|-$)+/g, '');         // limpia guiones al inicio/fin
  }
}
