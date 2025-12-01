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
export class ProductFormComponent implements OnChanges {

  // ==========================================================================
  // INPUTS / OUTPUTS
  // ==========================================================================

  /**
   * Producto que se está editando.
   * - Si viene con datos → modo edición.
   * - Si es null → modo creación (se asume producto nuevo).
   */
  @Input() product: Product | null = null;

  /**
   * Evento que emite el objeto Product final cuando el formulario es válido
   * y el usuario hace submit.
   */
  @Output() save = new EventEmitter<Product>();

  /**
   * Evento simple para avisar al padre que el usuario canceló
   * (cerrar modal, panel lateral, etc.).
   */
  @Output() cancel = new EventEmitter<void>();

  /**
   * Formulario reactivo principal.
   * Se inicializa en el constructor con todos los campos del producto.
   */
  form: FormGroup;

  // ==========================================================================
  // OPCIONES PREDEFINIDAS (CATALOGOS)
  // ==========================================================================

  /**
   * Categorías permitidas para los productos.
   * Es importante mantener este listado alineado con lo que entiende el modelo
   * ProductCategory y con los filtros del front (cards, listados, etc.).
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
   * Condiciones del producto (estado).
   * - nuevo  → producto sin uso.
   * - usado  → producto de segunda mano.
   * Ayuda a mostrar badges o textos distintos en las cards.
   */
  conditionOptions: ProductCondition[] = ['nuevo', 'usado'];

  // ==========================================================================
  // CONSTRUCTOR: definición del formulario
  // ==========================================================================
  constructor(private fb: FormBuilder) {
    /**
     * Definición del FormGroup con:
     * - campos base obligatorios (name, category, price, description)
     * - campos opcionales (brand, model, year, imageUrl, etc.)
     * - flags editoriales para controlar visibilidad en el sitio.
     *
     * Notas:
     * - category parte en null para obligar a elegir.
     * - condition parte en "usado" como caso más frecuente.
     * - stock parte en 1 (mínimo razonable para publicar algo a la venta).
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
   * ngOnChanges
   * Se ejecuta cada vez que cambia algún @Input del componente.
   * Aquí nos interesa especialmente el cambio en `product`:
   *
   * - Si llega un product con datos:
   *   Relleno el formulario con sus valores (modo edición).
   *
   * - Si pasa de tener producto a null:
   *   Reseteo el formulario con valores por defecto (modo creación).
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
   * hasError
   * Helper rápido para el template.
   * Retorna true si el control tiene el error indicado y ya fue "tocado".
   *
   * Uso típico en el HTML:
   *   *ngIf="hasError('name', 'required')"
   *
   * Esto evita repetir lógica de:
   *   const c = this.form.get('name'); c && c.touched && c.hasError('required')
   */
  hasError(ctrl: string, type: string): boolean {
    const c = this.form.get(ctrl);
    return !!c && c.touched && c.hasError(type);
  }

  // ==========================================================================
  // SUBMIT / CANCEL
  // ==========================================================================

  /**
   * onSubmit
   * Se ejecuta cuando el usuario envía el formulario.
   *
   * Flujo:
   * 1. Si el formulario es inválido → marco todos los controles como "touched"
   *    para que aparezcan los mensajes de error y no hago nada más.
   * 2. Si es válido:
   *    - Tomo los valores del form.
   *    - Armo un objeto Product completo.
   *    - Mantengo id y slug existentes si es modo edición.
   *    - Si no hay slug previo, lo genero desde el nombre.
   *    - Normalizo campos opcionales a undefined cuando están vacíos.
   *    - Emite el Product final al padre mediante this.save.emit().
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
   * onCancel
   * Notifica al componente padre que se canceló la edición/creación.
   * No toca el form ni los datos, solo emite el evento.
   */
  onCancel() {
    this.cancel.emit();
  }

  // ==========================================================================
  // UTILIDADES
  // ==========================================================================

  /**
   * slugify
   * Convierte el nombre del producto en un slug "URL-friendly".
   *
   * Pasos:
   * - Normaliza el nombre para eliminar acentos.
   * - Lo pasa a minúsculas.
   * - Reemplaza cualquier cosa que no sea [a-z0-9] por guiones.
   * - Limpia guiones sobrantes al inicio y al final.
   *
   * Ejemplo:
   *   "Guitarra Eléctrica Stratocaster 2024" →
   *   "guitarra-electrica-stratocaster-2024"
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
