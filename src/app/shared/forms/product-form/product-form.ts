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

import {
  Product,
  ProductCondition,
} from '@core/models/product.model';
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
  // OPCIONES PREDEFINIDAS (CATALOGOS)
  // ==========================================================================

  /**
   * @description
   * Categorías permitidas para los productos.
   *
   * Debe estar alineado con:
   * - el tipo `ProductCategory`
   * - los filtros de la vista de productos
   * - el banner de categorías del frontend.
   */
  categoryOptions: ProductCategory[] = [
    'guitarras',
    'bajos',
    'pedales',
    'amplificadores',
    'accesorios',
    'otros',
  ];

  /**
   * @description
   * Condiciones del producto (estado de uso).
   *
   * - `"nuevo"` → producto sin uso.
   * - `"usado"` → producto de segunda mano.
   *
   * Se usa para mostrar badges o textos específicos en las cards.
   */
  conditionOptions: ProductCondition[] = ['nuevo', 'usado'];

  // ==========================================================================
  // CONSTRUCTOR: definición del formulario
  // ==========================================================================

  /**
   * @description
   * Constructor del componente.
   *
   * - Inyecta `FormBuilder`.
   * - Define el `FormGroup` con campos obligatorios y opcionales.
   * - Configura valores por defecto coherentes para modo creación.
   *
   * @param fb Servicio `FormBuilder` para construir formularios reactivos.
   *
   * @usageNotes
   * - `category` comienza en `null` para obligar a elegir.
   * - `condition` comienza en `"usado"` como caso frecuente.
   * - `stock` comienza en `1` como mínimo razonable para publicar algo.
   */
  constructor(private fb: FormBuilder) {
    /**
     * Definición del FormGroup con:
     * - campos base obligatorios (name, category, price, description)
     * - campos opcionales (brand, model, year, imageUrl, etc.)
     * - flags editoriales para controlar visibilidad en el sitio.
     */
    this.form = this.fb.group({
      // Datos principales del producto
      name: ['', Validators.required],
      category: [null as ProductCategory | null, Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],

      // Descripciones (shortDescription se usa para cards, description para detalle)
      shortDescription: [''],
      description: ['', Validators.required],

      // Datos técnicos / complementarios
      brand: [''],
      model: [''],
      year: [null],
      condition: ['usado' as ProductCondition],
      stock: [1, [Validators.min(0)]],
      imageUrl: [''],

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
   *
   * @example
   * ```ts
   * ngOnChanges(changes: SimpleChanges) {
   *   if (changes['product']) { ... }
   * }
   * ```
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product']) {
      // MODO EDICIÓN: hay un producto → cargo sus datos en el form.
      if (this.product) {
        this.form.patchValue({
          name: this.product.name,
          category: this.product.category,
          price: this.product.price,

          shortDescription: this.product.shortDescription ?? '',
          description: this.product.description,
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
      } else {
        // MODO CREACIÓN: product = null → form en blanco con defaults.
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
    }
  }

  // ==========================================================================
  // HELPERS DE VALIDACIÓN
  // ==========================================================================

  /**
   * @description
   * Helper rápido para el template que indica si un control
   * tiene un error específico y ya fue tocado.
   *
   * @param ctrl Nombre del control dentro del `FormGroup`.
   * @param type Tipo de error a comprobar (ej. `'required'`, `'min'`).
   * @returns `true` si el control tiene ese error y está `touched`.
   *
   * @example
   * ```html
   * <div *ngIf="hasError('name', 'required')">
   *   El nombre del producto es obligatorio.
   * </div>
   * ```
   */
  hasError(ctrl: string, type: string): boolean {
    const c = this.form.get(ctrl);
    return !!c && c.touched && c.hasError(type);
  }

  // ==========================================================================
  // SUBMIT / CANCEL
  // ==========================================================================

  /**
   * @description
   * Maneja el envío del formulario.
   *
   * Flujo:
   * 1. Si el formulario es inválido:
   *    - Marca todos los controles como `touched`.
   *    - No emite nada.
   *
   * 2. Si es válido:
   *    - Obtiene los valores crudos del form.
   *    - Construye un objeto `Product` completo.
   *    - Mantiene `id` y `slug` existentes en modo edición.
   *    - Genera un `slug` nuevo desde el nombre si no existía.
   *    - Normaliza campos opcionales vacíos a `undefined`.
   *    - Emite el `Product` final mediante `this.save.emit(product)`.
   *
   * @usageNotes
   * El componente padre debe suscribirse al evento `(save)` para persistir
   * o actualizar el producto en la capa de datos.
   */
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;
    const base = this.product;

    // Objeto Product que se enviará al componente padre.
    const product: Product = {
      // Si ya existe un producto, mantengo su id.
      // Si no, genero un id nuevo con crypto.randomUUID()
      id: base?.id ?? crypto.randomUUID(),

      // Slug: si ya existía lo mantengo, si no lo genero a partir del nombre.
      slug: base?.slug ?? this.slugify(v.name),

      // Datos principales
      name: v.name,
      category: v.category,
      price: v.price,

      // Si las cadenas opcionales están vacías, las paso a undefined
      // para no llenar el modelo con strings vacíos.
      shortDescription: v.shortDescription || undefined,
      description: v.description,

      brand: v.brand || undefined,
      model: v.model || undefined,
      year: v.year || undefined,
      condition: v.condition || 'usado',
      stock: v.stock ?? 1,

      imageUrl: v.imageUrl || undefined,

      // Flags editoriales tal como vienen del form
      showInCarousel: v.showInCarousel,
      isFeatured: v.isFeatured,
      isOffer: v.isOffer,
      isNew: v.isNew,
      isActive: v.isActive,
    };

    this.save.emit(product);
  }

  /**
   * @description
   * Notifica al componente padre que se canceló la edición/creación.
   *
   * No modifica el formulario ni los datos; solo emite el evento `cancel`.
   *
   * @example
   * ```html
   * <button type="button" (click)="onCancel()">Cancelar</button>
   * ```
   */
  onCancel() {
    this.cancel.emit();
  }

  // ==========================================================================
  // UTILIDADES
  // ==========================================================================

  /**
   * @description
   * Convierte el nombre del producto en un slug "URL-friendly".
   *
   * Pasos:
   * - Normaliza el nombre para eliminar acentos.
   * - Lo pasa a minúsculas.
   * - Reemplaza cualquier carácter que no sea `[a-z0-9]` por guiones.
   * - Quita guiones sobrantes al inicio y al final.
   *
   * @param name Nombre crudo del producto (ej: `"Guitarra Eléctrica Stratocaster 2024"`).
   * @returns Slug normalizado (ej: `"guitarra-electrica-stratocaster-2024"`).
   *
   * @example
   * ```ts
   * const slug = this.slugify('Pedal Overdrive Súper Vintage');
   * // 'pedal-overdrive-super-vintage'
   * ```
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
