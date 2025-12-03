// ============================================================================
// COURSE FORM COMPONENT
// ----------------------------------------------------------------------------
// Formulario de administración para crear / editar cursos.
//
// - Usa Reactive Forms (FormBuilder + FormGroup).
// - Centraliza presets de dificultad, duración, modalidad, precios, rating, tags.
// - Emite un objeto Course completo y coherente hacia el componente padre.
// - Encapsula la lógica de:
//     * Duraciones predefinidas (duración en texto + horas + cantidad de clases)
//     * Modalidades (Presencial / Online / Ambas) como presets
//     * Precios, rating y etiquetas (tags) preconfigurables
//     * Generación automática de slug a partir del título
//     * Transformación entre campos de texto multilinea y arrays (stages, learnOutcomes)
// ============================================================================

import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  Course,
  CourseDifficulty,
  CourseModality,
} from '@core/models/course.model';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './course-form.html',
  styleUrls: ['./course-form.css'],
})
/**
 * @description
 * Componente de formulario avanzado para crear y editar entidades `Course`.
 *
 * Responsabilidades:
 * - Orquestar un `FormGroup` con todos los campos necesarios del modelo.
 * - Ofrecer presets configurables (duración, modalidad, precios, rating, tags).
 * - Convertir inputs “amigables” del admin (selects, textareas) en un
 *   objeto `Course` completo, coherente y listo para persistir.
 * - Emitir el curso normalizado hacia el componente padre mediante `@Output()`.
 *
 * @usageNotes
 * ```html
 * <app-course-form
 *   [course]="cursoSeleccionado"
 *   (save)="onSave($event)"
 *   (cancel)="onCancel()">
 * </app-course-form>
 * ```
 */
export class CourseFormComponent implements OnChanges {
  // ============================================================
  // INPUT / OUTPUT
  // ============================================================

  /**
   * @description
   * Curso a editar. Si es `null`, el formulario funciona en modo “crear”.
   */
  @Input() course: Course | null = null;

  /**
   * @description
   * Emite un objeto `Course` completamente normalizado cuando el formulario
   * es válido y se confirma el envío.
   *
   * @example
   * ```ts
   * onSave(course: Course) {
   *   this.courseService.upsert(course);
   * }
   * ```
   */
  @Output() save = new EventEmitter<Course>();

  /**
   * @description
   * Evento simple para notificar al componente padre que el usuario canceló
   * la edición/creación. Ideal para cerrar modales, drawers o paneles.
   */
  @Output() cancel = new EventEmitter<void>();

  /** Formulario reactivo interno. */
  form!: FormGroup;

  /** Flag para mostrar mensajes de validación tras el submit. */
  submitted = false;

  // ============================================================
  // OPCIONES PREDEFINIDAS (CATÁLOGOS)
  // ============================================================

  /** Dificultades disponibles para el curso. */
  difficultyOptions: CourseDifficulty[] = [
    'Principiante',
    'Intermedio',
    'Avanzado',
  ];

  /**
   * @description
   * Presets de duración:
   * - `duration`       → etiqueta visible en el front.
   * - `durationHours`  → horas totales numéricas.
   * - `totalLessons`   → cantidad de clases.
   *
   * @usageNotes
   * El formulario guarda el índice del preset (`durationPreset`) y
   * estos valores se copian automáticamente a los campos derivados.
   */
  durationPresets = [
    {
      label: '8 h · 4 clases',
      duration: '8 h · 4 clases',
      durationHours: 8,
      totalLessons: 4,
    },
    {
      label: '12 h · 6 clases',
      duration: '12 h · 6 clases',
      durationHours: 12,
      totalLessons: 6,
    },
    {
      label: '16 h · 8 clases',
      duration: '16 h · 8 clases',
      durationHours: 16,
      totalLessons: 8,
    },
    {
      label: '20 h · 10 clases',
      duration: '20 h · 10 clases',
      durationHours: 20,
      totalLessons: 10,
    },
  ];

  /**
   * @description
   * Modalidades preconfiguradas:
   * - `value`      → lo que se guarda temporalmente en el form.
   * - `label`      → texto visible en el select.
   * - `modalities` → arreglo real de `CourseModality` que termina en el modelo.
   *
   * @example
   * ```ts
   * // value 'presencial-online' → ['Presencial', 'Online']
   * ```
   */
  modalityPresets: {
    value: string;
    label: string;
    modalities: CourseModality[];
  }[] = [
    {
      value: 'presencial',
      label: 'Presencial',
      modalities: ['Presencial'],
    },
    {
      value: 'online',
      label: 'Online',
      modalities: ['Online'],
    },
    {
      value: 'presencial-online',
      label: 'Presencial y online',
      modalities: ['Presencial', 'Online'],
    },
  ];

  /** Presets típicos de precios para cursos (en CLP). */
  presetPricesCLP: number[] = [39990, 49990, 69990, 89990, 119990];

  /** Presets opcionales para precio por hora. */
  pricePerHourPresets: number[] = [10000, 15000, 20000, 25000];

  /**
   * @description
   * Presets de rating para no inventar números cada vez.
   * Permiten marcar cursos como “nuevo”, “consolidado” o “top” rápidamente.
   */
  ratingPresets = [
    {
      label: 'Nuevo (sin reseñas)',
      rating: null as number | null,
      ratingCount: 0,
    },
    {
      label: 'Curso nuevo (4.5 ★, 3 reseñas)',
      rating: 4.5,
      ratingCount: 3,
    },
    {
      label: 'Curso consolidado (4.7 ★, 25 reseñas)',
      rating: 4.7,
      ratingCount: 25,
    },
    {
      label: 'Top (4.9 ★, 60 reseñas)',
      rating: 4.9,
      ratingCount: 60,
    },
  ];

  /**
   * @description
   * Catálogo global de tags para cursos.
   * Se manejan tanto como:
   * - checkboxes (colección `selectedTags`)
   * - string CSV en el form (`tags`).
   */
  allTags: string[] = [
    'guitarra',
    'bajo',
    'batería',
    'teclado',
    'rock',
    'metal',
    'blues',
    'jazz',
    'improvisación',
    'principiantes',
    'intermedio',
    'avanzado',
    'online',
    'presencial',
  ];

  /** Lista de tags seleccionados vía UI (checkboxes). */
  selectedTags: string[] = [];

  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  /**
   * @description
   * Constructor del componente.
   *
   * - Inyecta `FormBuilder`.
   * - Construye el `FormGroup` inicial con todos los campos y defaults.
   *
   * @param fb Servicio `FormBuilder` para crear formularios reactivos.
   *
   * @example
   * ```ts
   * constructor(private fb: FormBuilder) {
   *   this.buildForm();
   * }
   * ```
   */
  constructor(private fb: FormBuilder) {
    this.buildForm();
  }

  // ============================================================
  // CICLO DE VIDA
  // ============================================================

  /**
   * @description
   * Hook que se dispara cuando cambia el `@Input() course`.
   *
   * Casos:
   * - `course === null` → modo crear (reset con defaults).
   * - `course` con valor → modo editar (se rellenan los campos).
   *
   * @param changes Cambios detectados en las propiedades de entrada.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['course']) {
      this.patchForm();
    }
  }

  // ============================================================
  // FORM GROUP: definición de campos y defaults
  // ============================================================

  /**
   * @description
   * Construye el `FormGroup` principal del formulario con:
   * - campos básicos de identificación
   * - dificultad, duración, modalidad
   * - descripciones
   * - rating
   * - precios
   * - tags y flags de visibilidad
   *
   * También aplica el preset inicial de duración para mantener coherencia.
   *
   * @usageNotes
   * Este método solo se llama una vez en el constructor.
   */
  private buildForm(): void {
    this.form = this.fb.group({
      // Identificación básica
      title: ['', [Validators.required]],
      slug: [''], // se autogenera desde el título si viene vacío
      tutorId: ['', [Validators.required]],
      tutorName: ['', [Validators.required]],

      // Dificultad
      difficulty: ['intermedio', [Validators.required]],

      // Duración (se controla solo por preset)
      durationPreset: [2, [Validators.required]],
      duration: ['16 h · 8 clases', [Validators.required]],
      durationHours: [16],
      totalLessons: [8],

      // Modalidad (selector que luego se traduce a array modalities)
      modalityPreset: ['presencial-online', [Validators.required]],

      // Contenido descriptivo
      shortDescription: ['', [Validators.required]],
      description: ['', [Validators.required]],
      imageUrl: [''],

      // Textareas “multilínea” que se convertirán en arrays
      stagesText: [''],
      learnOutcomesText: [''],

      // Rating opcional
      rating: [null],
      ratingCount: [null],

      // Precios
      priceCLP: [89990, [Validators.required, Validators.min(0)]],
      pricePerHour: [null],

      // Tags: se guarda como string pero se sincroniza con selectedTags
      tags: [''],

      // Flags de visibilidad / destacados
      showInCarousel: [true],
      isFeatured: [true],
      isOffer: [false],
      isNew: [true],
      isActive: [true],
    });

    // Aplica preset inicial de duración para mantener coherencia.
    this.applyDurationPreset(this.form.get('durationPreset')?.value ?? 2);
  }

  /**
   * @description
   * Rellena el formulario en función del `@Input() course`.
   *
   * - Si no hay curso → configura el form en modo “crear” con valores default.
   * - Si existe curso → detecta presets de duración y modalidad, y carga
   *   el resto de campos incluyendo textareas y tags.
   *
   * @usageNotes
   * Llamado automáticamente desde `ngOnChanges`.
   */
  private patchForm(): void {
    // MODO CREAR
    if (!this.course) {
      this.form.reset({
        title: '',
        slug: '',
        tutorId: '',
        tutorName: '',
        difficulty: 'intermedio',

        durationPreset: 2,
        duration: '16 h · 8 clases',
        durationHours: 16,
        totalLessons: 8,

        modalityPreset: 'presencial-online',

        shortDescription: '',
        description: '',
        imageUrl: '',

        stagesText: '',
        learnOutcomesText: '',

        rating: null,
        ratingCount: null,

        priceCLP: 89990,
        pricePerHour: null,

        tags: '',

        showInCarousel: true,
        isFeatured: true,
        isOffer: false,
        isNew: true,
        isActive: true,
      });

      this.selectedTags = [];
      return;
    }

    // MODO EDITAR
    // --------------------------------------------
    // 1) Buscar preset que coincida con la duración existente
    let durationPresetIndex = 2;
    if (this.course.duration) {
      const found = this.durationPresets.findIndex(
        d => d.duration === this.course!.duration
      );
      if (found !== -1) {
        durationPresetIndex = found;
      }
    }
    const durationPreset = this.durationPresets[durationPresetIndex];

    // 2) Inferir preset de modalidad a partir del array modalities
    const modalityPresetValue = this.inferModalityPreset(this.course.modalities);

    // 3) Cargar valores al form
    this.form.patchValue({
      title: this.course.title,
      slug: this.course.slug,
      tutorId: this.course.tutorId,
      tutorName: this.course.tutorName,
      difficulty: this.course.difficulty || 'intermedio',

      durationPreset: durationPresetIndex,
      duration: this.course.duration || durationPreset.duration,
      durationHours: this.course.durationHours ?? durationPreset.durationHours,
      totalLessons:
        this.course.totalLessons ??
        this.course.lessonsCount ??
        durationPreset.totalLessons,

      modalityPreset: modalityPresetValue,

      shortDescription: this.course.shortDescription,
      description: this.course.description,
      imageUrl: this.course.imageUrl || '',

      stagesText: (this.course.stages || []).join('\n'),
      learnOutcomesText: (this.course.learnOutcomes || []).join('\n'),

      rating: this.course.rating ?? null,
      ratingCount: this.course.ratingCount ?? null,

      priceCLP: this.course.priceCLP ?? 89990,
      pricePerHour: this.course.pricePerHour ?? null,

      tags: this.course.tags?.join(', ') || '',

      showInCarousel: this.course.showInCarousel ?? true,
      isFeatured: this.course.isFeatured ?? false,
      isOffer: this.course.isOffer ?? false,
      isNew: this.course.isNew ?? true,
      isActive: this.course.isActive ?? true,
    });

    this.selectedTags = this.course.tags ? [...this.course.tags] : [];
  }

  /**
   * @description
   * A partir del array de `CourseModality`, devuelve el `value` del preset
   * de modalidad que mejor representa esa combinación.
   *
   * @param modalities Arreglo de modalidades del curso.
   * @returns `presencial`, `online` o `presencial-online`.  
   *          Si no se puede inferir, devuelve el preset por defecto.
   *
   * @example
   * ```ts
   * inferModalityPreset(['Presencial', 'Online']); // 'presencial-online'
   * ```
   */
  private inferModalityPreset(modalities: CourseModality[] = []): string {
    const hasPresencial = modalities.includes('Presencial');
    const hasOnline = modalities.includes('Online');

    if (hasPresencial && hasOnline) return 'presencial-online';
    if (hasPresencial) return 'presencial';
    if (hasOnline) return 'online';

    // fallback coherente con el default del form
    return 'presencial-online';
  }

  // ============================================================
  // HELPERS DE FORM / VALIDACIÓN
  // ============================================================

  /** Acceso corto a los controles del form en el template. */
  get f() {
    return this.form.controls;
  }

  /**
   * @description
   * Helper genérico de validación:
   * devuelve `true` si un control tiene un error específico y ya fue tocado,
   * modificado o el formulario fue enviado.
   *
   * @param controlName Nombre del control dentro del formulario.
   * @param error Nombre del error (ej: 'required', 'minlength').
   * @returns `true` si el control debe mostrar ese mensaje de error.
   *
   * @example
   * ```html
   * <div *ngIf="hasError('title', 'required')">
   *   El título es obligatorio.
   * </div>
   * ```
   */
  hasError(controlName: string, error: string): boolean {
    const control = this.form.get(controlName);
    if (!control) return false;
    return (
      (control.dirty || control.touched || this.submitted) &&
      control.hasError(error)
    );
  }

  /**
   * @description
   * Aplica un preset de duración (por índice) y copia sus valores
   * a los campos derivados del formulario:
   * - `duration`
   * - `durationHours`
   * - `totalLessons`
   *
   * No emite eventos de cambio (`emitEvent: false`).
   *
   * @param index Índice del preset dentro de `durationPresets`.
   */
  private applyDurationPreset(index: number): void {
    const preset = this.durationPresets[index];
    if (!preset) return;

    this.form.patchValue(
      {
        duration: preset.duration,
        durationHours: preset.durationHours,
        totalLessons: preset.totalLessons,
      },
      { emitEvent: false }
    );
  }

  // ============================================================
  // HANDLERS DE EVENTOS (selects, checkboxes, etc.)
  // ============================================================

  /**
   * @description
   * Handler para el cambio en el select de duración.
   * Toma el valor seleccionado (índice) y aplica el preset correspondiente.
   *
   * @param event Evento `change` del `<select>`.
   */
  onDurationPresetChange(event: Event): void {
    const select = event.target as HTMLSelectElement | null;
    if (!select) return;

    const index = Number(select.value);
    if (Number.isNaN(index)) return;
    this.applyDurationPreset(index);
  }

  /**
   * @description
   * Aplica un preset de rating (nota + cantidad de reseñas) en el formulario.
   *
   * @param event Evento `change` del `<select>` de presets de rating.
   */
  onRatingPresetChange(event: Event): void {
    const select = event.target as HTMLSelectElement | null;
    if (!select) return;

    if (select.value === '') return;

    const presetIndex = Number(select.value);
    const preset = this.ratingPresets[presetIndex];
    if (!preset) return;

    this.form.patchValue({
      rating: preset.rating,
      ratingCount: preset.ratingCount,
    });
  }

  /**
   * @description
   * Establece el `pricePerHour` en base a un preset seleccionado.
   *
   * @param event Evento `change` del `<select>` de precio/hora.
   */
  onPricePerHourPreset(event: Event): void {
    const select = event.target as HTMLSelectElement | null;
    if (!select) return;

    const value = select.value === '' ? null : Number(select.value);
    this.form.patchValue({ pricePerHour: value });
  }

  /**
   * @description
   * Activa o desactiva un tag en la colección `selectedTags` y sincroniza
   * el campo `tags` del formulario como string CSV.
   *
   * @param tag Tag a activar/desactivar.
   * @param checked Estado del checkbox (`true` = seleccionado).
   *
   * @example
   * ```ts
   * onToggleTag('rock', true); // agrega 'rock' a selectedTags
   * ```
   */
  onToggleTag(tag: string, checked: boolean): void {
    if (checked) {
      if (!this.selectedTags.includes(tag)) {
        this.selectedTags = [...this.selectedTags, tag];
      }
    } else {
      this.selectedTags = this.selectedTags.filter(t => t !== tag);
    }

    this.form.patchValue(
      { tags: this.selectedTags.join(', ') },
      { emitEvent: false }
    );
  }

  /**
   * @description
   * Convierte un título a `slug` URL-friendly:
   * - pasa a minúsculas
   * - elimina acentos
   * - reemplaza espacios/símbolos por guiones
   *
   * @param value Texto de entrada (generalmente el título del curso).
   * @returns Slug normalizado (ej: `"Curso de Guitarra Rock"` → `"curso-de-guitarra-rock"`).
   */
  private slugify(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // ============================================================
  // SUBMIT / CANCEL
  // ============================================================

  /**
   * @description
   * Construye un objeto `Course` completo a partir de los valores del form:
   *
   * - Genera `slug` si está vacío (usando el título).
   * - Aplica presets de modalidad y duración.
   * - Convierte textareas multilínea en arrays (`stages`, `learnOutcomes`).
   * - Normaliza tags, precios, rating y flags de visibilidad.
   * - Preserva `id` y propiedades previas si ya existía un curso.
   *
   * Al final, emite el curso resultante mediante `this.save.emit(course)`.
   *
   * @usageNotes
   * Si el form es inválido:
   * - marca todos los campos como tocados
   * - no emite ningún valor
   */
  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;
    const difficulty = value.difficulty as CourseDifficulty;

    // Slug oculto: fallback a título
    let slug = value.slug as string;
    if (!slug && value.title) {
      slug = this.slugify(value.title);
    }

    // Duración y estructura ya vienen de los presets
    const duration = value.duration as string;
    const durationHours = Number(value.durationHours) || undefined;
    const totalLessons = Number(value.totalLessons) || undefined;

    // Modalidades a partir del preset elegido
    const modalityPreset =
      this.modalityPresets.find(m => m.value === value.modalityPreset) ??
      this.modalityPresets[2];
    const modalities = modalityPreset.modalities;

    // Textareas → arrays
    const stages =
      value.stagesText && typeof value.stagesText === 'string'
        ? value.stagesText
            .split('\n')
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [];

    const learnOutcomes =
      value.learnOutcomesText && typeof value.learnOutcomesText === 'string'
        ? value.learnOutcomesText
            .split('\n')
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [];

    // Tags: preferimos selectedTags si existen, si no, usamos el string CSV
    let tags =
      value.tags && typeof value.tags === 'string'
        ? value.tags
            .split(',')
            .map((t: string) => t.trim())
            .filter(Boolean)
        : [];

    if (this.selectedTags.length) {
      tags = [...this.selectedTags];
    }

    // Base del curso: si ya existía, preservamos id y demás propiedades.
    const base = this.course || {
      id: crypto.randomUUID(),
    };

    const priceCLP = Number(value.priceCLP) || 0;
    const price = priceCLP;

    // Etiqueta de precio formateada para mostrar en cards.
    const priceLabel = new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    }).format(priceCLP);

    const course: Course = {
      ...base,
      title: value.title,
      slug,
      tutorId: value.tutorId,
      tutorName: value.tutorName,
      difficulty,
      level: difficulty,

      duration,
      durationHours,
      totalLessons,

      shortDescription: value.shortDescription,
      description: value.description,
      imageUrl: value.imageUrl || '',

      modalities,
      stages,
      learnOutcomes,

      rating: value.rating ? Number(value.rating) : undefined,
      ratingCount: value.ratingCount ? Number(value.ratingCount) : undefined,

      priceCLP,
      price,
      priceLabel,
      pricePerHour: value.pricePerHour
        ? Number(value.pricePerHour)
        : undefined,

      tags,

      showInCarousel: !!value.showInCarousel,
      isFeatured: !!value.isFeatured,
      isOffer: !!value.isOffer,
      isNew: !!value.isNew,
      isActive: !!value.isActive,
    };

    this.save.emit(course);
  }

  /**
   * @description
   * Notifica al componente padre que el usuario canceló la edición/creación.
   *
   * No altera el estado del formulario; se delega al padre la decisión
   * de cerrar modales, descartar cambios, etc.
   *
   * @example
   * ```html
   * <button type="button" (click)="onCancel()">Cancelar</button>
   * ```
   */
  onCancel(): void {
    this.cancel.emit();
  }
}
