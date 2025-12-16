
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
//    • Generar un slug simple a partir del nombre cuando no existe uno previo.
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

  /**
   * @description
   * Producto que se está editando.
   *
   * - Si viene con datos → modo edición.
   * - Si es `null` → modo creación (producto nuevo).
   */
  @Input() product: Product | null = null;

  /**
   * @description
   * Evento que emite el objeto `Product` final cuando el formulario es válido
   * y el usuario hace submit.
   *
   * @example
   * ```ts
   * onSave(product: Product) {
   *   this.productService.upsert(product);
   * }
   * ```
   */
  @Output() save = new EventEmitter<Product>();

  /**
   * @description
   * Evento simple para avisar al padre que el usuario canceló
   * (cerrar modal, panel lateral, dialog, etc.).
   */
  @Output() cancel = new EventEmitter<void>();

  /**
   * @description
   * Formulario reactivo principal que contiene todos los campos
   * del modelo `Product` que se administran desde esta vista.
   */
  form: FormGroup;

  // ==========================================================================
  // OPCIONES (SELECTS)
  // ==========================================================================

  /** Lista de categorías disponibles para el catálogo. */
  categoryOptions: ProductCategory[] = [
    'guitarras',
    'bajos',
    'pedales',
    'amplificadores',
    'accesorios',
  ];

  /** Condiciones permitidas. */
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
    'https://polarvectors.com/wp-content/uploads/2023/06/Guitar-SVG.jpg';

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

      // Flags editoriales que afectan cómo y dónde se muestra el producto
      showInCarousel: [false],
      isFeatured: [false],
      isOffer: [false],
      isNew: [false],
      isActive: [true],
    });
  }

  // ==========================================================================
  // CICLO DE VIDA: sincronizar el formulario cuando cambia @Input() product
  // ==========================================================================

  /**
   * @description
   * Hook de ciclo de vida que se ejecuta cada vez que cambia un `@Input`.
   *
   * Aquí nos interesa el cambio en `product`:
   * - Si llega un producto con datos → modo edición (se rellenan campos).
   * - Si pasa de tener producto a `null` → modo creación (form reset con defaults).
   *
   * @param changes Mapa de cambios detectados en las propiedades de entrada.
   */
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

        // Trim para evitar que quede " " y el usuario crea que hay imagen
        imageUrl: (this.product.imageUrl ?? '').toString().trim(),

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
   * Helper para saber si un control está inválido y tocado (para feedback visual).
   */
  isInvalid(controlName: string): boolean {
    const c = this.form.get(controlName);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  // ==========================================================================
  // EVENTOS
  // ==========================================================================

  /**
   * @method onSubmit
   * @description
   * - Si el formulario es inválido, fuerza validaciones visuales.
   * - Si es válido, normaliza el Product:
   *    • slug (si no existe)
   *    • imageUrl (fallback si viene vacío)
   * - Emite `save` para que el contenedor persista en localStorage.
   */
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;

    // Si el usuario no puso imagen, usamos placeholder
    const imageCandidate = (v.imageUrl ?? '').toString().trim();
    const finalImageUrl =
      imageCandidate.length > 0 ? imageCandidate : this.FALLBACK_IMAGE_URL;

    const finalSlug = this.product?.slug ?? this.slugify(v.name as string);

    const product: Product = {
      // Mantener ID si editamos; crear uno si estamos creando
      id: this.product?.id ?? crypto.randomUUID(),

      // Normalización de rutas
      slug: finalSlug,

      // Datos principales
      name: v.name,
      category: v.category,
      price: v.price,

      shortDescription: v.shortDescription,
      description: v.description,

      // Datos técnicos
      brand: v.brand,
      model: v.model,
      year: v.year,
      condition: v.condition,
      stock: v.stock,

      // Imagen (fallback garantizado)
      imageUrl: finalImageUrl,

      // Flags
      showInCarousel: !!v.showInCarousel,
      isFeatured: !!v.isFeatured,
      isOffer: !!v.isOffer,
      isNew: !!v.isNew,
      isActive: !!v.isActive,

      // createdAt: conservar si existe; si no, generarlo
      createdAt: this.product?.createdAt ?? new Date().toISOString(),
    };

    this.save.emit(product);
  }

  /**
   * @description
   * Botón cancelar del formulario.
   */
  onCancel(): void {
    this.cancel.emit();
  }

  // ==========================================================================
  // UTILIDADES
  // ==========================================================================

  /**
   * @description
   * Genera un slug URL-safe desde un texto.
   */
  private slugify(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
}
