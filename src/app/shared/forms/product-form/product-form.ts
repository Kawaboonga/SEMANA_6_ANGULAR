// src/app/shared/forms/product-form/product-form.ts

// ============================================================================
// PRODUCT FORM COMPONENT
// ----------------------------------------------------------------------------
// Formulario de administración para crear / editar productos del catálogo.
//
// Idea general:
// - Usa Reactive Forms para controlar todos los campos del producto.
// - Soporta dos modos: crear (product = null) y editar (product con datos).
// - Se encarga de:
//    • Cargar los datos del producto seleccionado en el formulario.
//    • Definir valores por defecto coherentes cuando no hay producto.
//    • Validar lo mínimo indispensable (nombre, categoría, precio, descripción).
//    • Normalizar el objeto Product que se emite al componente padre.
//    • Generar un slug simple a partir del nombre cuando no existe.
// - Flags editoriales (showInCarousel, isFeatured, etc.) se controlan aquí,
//   para definir qué aparece en el home, qué va en carruseles, ofertas, etc.
// ============================================================================

import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { Product, ProductCondition } from '@core/models/product.model';
import { ProductCategory } from '@core/models/product-category.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.html',
})
/**
 * @description
 * Componente de administración para crear y editar entidades `Product` del catálogo.
 *
 * Responsabilidades:
 * - Orquestar un formulario reactivo con todos los campos del producto.
 * - Soportar dos modos: creación (`product = null`) y edición (`product` con datos).
 * - Normalizar el objeto `Product` antes de emitirlo (slug, opcionales, flags).
 * - Mantener flags editoriales que controlan visibilidad en home, carruseles y ofertas.
 *
 * @usageNotes
 * ```html
 * <app-product-form
 *   [product]="productoSeleccionado"
 *   (save)="onSaveProduct($event)"
 *   (cancel)="onCancelEdit()">
 * </app-product-form>
 * ```
 */
export class ProductFormComponent implements OnChanges {
  // ==========================================================================
  // INPUTS / OUTPUTS
  // ==========================================================================

  @Input() product: Product | null = null;
  @Output() save = new EventEmitter<Product>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

  // ==========================================================================
  // OPCIONES (SELECTS)
  // ==========================================================================

  categoryOptions: ProductCategory[] = [
    'guitarras',
    'bajos',
    'pedales',
    'amplificadores',
    'accesorios',
  ];

  conditionOptions: ProductCondition[] = ['nuevo', 'usado'];

  // ==========================================================================
  // CONFIGURACIÓN
  // ==========================================================================

  /**
   * Imagen de relleno (placeholder).
   * Si el usuario no ingresa imageUrl, asignamos este valor.
   *
   * Nota:
   * - Esta vez usamos una URL pública (requerimiento tuyo).
   * - Si en el futuro prefieres empaquetarla localmente, vuelve a assets/.
   */
  private readonly FALLBACK_IMAGE_URL =
    'assets/img/products/placeholder-guitar.jpg';

  constructor(private fb: FormBuilder) {
    // ------------------------------------------------------------------------
    // 1) Crear el formulario con valores por defecto.
    // ------------------------------------------------------------------------
    this.form = this.fb.group({
      // Datos principales del producto
      name: ['', Validators.required],
      category: [null as ProductCategory | null, Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],

      // Descripciones (shortDescription se usa para cards, description para detalle)
      shortDescription: ['', [Validators.required, Validators.minLength(10)]],
      description: ['', [Validators.required, Validators.minLength(10)]],

      // Datos técnicos / complementarios
      // (Ahora: obligatorios. Solo imagen es opcional.)
      brand: ['', Validators.required],
      model: ['', Validators.required],
      year: [
        null,
        [
          Validators.required,
          Validators.min(1900),
          Validators.max(new Date().getFullYear() + 1),
        ],
      ],
      condition: ['usado' as ProductCondition, Validators.required],
      stock: [1, [Validators.required, Validators.min(0)]],
      imageUrl: [''], // opcional

      // Flags editoriales
      showInCarousel: [false],
      isFeatured: [false],
      isOffer: [false],
      isNew: [false],
      isActive: [true],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['product']) return;

    // MODO EDICIÓN
    if (this.product) {
      this.form.patchValue({
        name: this.product.name,
        category: this.product.category,
        price: this.product.price,

        shortDescription: this.product.shortDescription ?? '',
        description: this.product.description ?? '',

        brand: this.product.brand ?? '',
        model: this.product.model ?? '',
        year: this.product.year ?? null,
        condition: this.product.condition ?? 'usado',
        stock: this.product.stock ?? 1,
        imageUrl: this.product.imageUrl ?? '',

        showInCarousel: this.product.showInCarousel ?? false,
        isFeatured: this.product.isFeatured ?? false,
        isOffer: this.product.isOffer ?? false,
        isNew: this.product.isNew ?? false,
        isActive: this.product.isActive ?? true,
      });

      return;
    }

    // MODO CREACIÓN
    this.form.reset({
      name: '',
      category: null,
      price: 0,

      shortDescription: '',
      description: '',

      brand: '',
      model: '',
      year: null,
      condition: 'usado',
      stock: 1,
      imageUrl: '',

      showInCarousel: false,
      isFeatured: false,
      isOffer: false,
      isNew: false,
      isActive: true,
    });
  }

  // ==========================================================================
  // HELPERS DE VALIDACIÓN
  // ==========================================================================

  /**
   * @description
   * Helper para saber si un control tiene un error específico y ya fue tocado.
   * (Tu HTML usa hasError(...), así que lo dejamos aquí como contrato estable.)
   */
  hasError(controlName: string, errorName: string): boolean {
    const c = this.form.get(controlName);
    return !!c && c.hasError(errorName) && (c.touched || c.dirty);
  }

  isInvalid(controlName: string): boolean {
    const c = this.form.get(controlName);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  // ==========================================================================
  // EVENTOS
  // ==========================================================================

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;

    // Si el usuario no puso imagen, usamos placeholder
    const finalImageUrl =
      (v.imageUrl ?? '').toString().trim().length > 0
        ? v.imageUrl.toString().trim()
        : this.FALLBACK_IMAGE_URL;

    const finalSlug = this.product?.slug ?? this.slugify(v.name as string);

    const product: Product = {
      id: this.product?.id ?? crypto.randomUUID(),
      slug: finalSlug,

      name: v.name,
      category: v.category,
      price: v.price,

      shortDescription: v.shortDescription,
      description: v.description,

      brand: v.brand,
      model: v.model,
      year: v.year,
      condition: v.condition,
      stock: v.stock,

      imageUrl: finalImageUrl,

      showInCarousel: !!v.showInCarousel,
      isFeatured: !!v.isFeatured,
      isOffer: !!v.isOffer,
      isNew: !!v.isNew,
      isActive: !!v.isActive,

      createdAt: this.product?.createdAt ?? new Date().toISOString(),
    };

    this.save.emit(product);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  // ==========================================================================
  // UTILIDADES
  // ==========================================================================

  private slugify(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
}
