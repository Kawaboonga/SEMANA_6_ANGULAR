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
export class CourseFormComponent implements OnChanges {
  // ============================================================
  // INPUT / OUTPUT
  // ============================================================

  /** Curso a editar. Si es null → modo crear. */
  @Input() course: Course | null = null;

  /** Emite el curso completo y normalizado cuando el form es válido. */
  @Output() save = new EventEmitter<Course>();

  /** Emite cuando el usuario cancela (cerrar modal / panel). */
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
   * Presets de duración:
   * - duration → etiqueta visible en el front.
   * - durationHours → horas totales numéricas.
   * - totalLessons → cantidad de clases.
   *
   * El admin solo elige el preset; no tiene que calcular nada.
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
   * Modalidades preconfiguradas:
   * - value   → lo que se guarda en el form como "preset".
   * - label   → lo que se muestra en el select.
   * - modalities → arreglo real de CourseModality que se persiste en el modelo.
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
   * Presets de rating para no inventar números cada vez.
   * Permite marcar cursos como “nuevo” o “top” rápidamente.
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
   * Catálogo global de tags para cursos.
   * Se usan tanto como checkboxes (selectedTags) como string CSV (tags).
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
  constructor(private fb: FormBuilder) {
    this.buildForm();
  }

  // ============================================================
  // CICLO DE VIDA
  // ============================================================

  /**
   * Se dispara cuando cambia el @Input() course (modo crear / editar).
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['course']) {
      this.patchForm();
    }
  }

  // ============================================================
  // FORM GROUP: definición de campos y defaults
  // ============================================================
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
   * Rellena el formulario cuando hay un curso (modo edición).
   * Si no hay curso → resetea con valores por defecto (modo crear).
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
   * A partir del array de CourseModality, devuelve el value del preset
   * que mejor lo representa.
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
   * Helper genérico de validación:
   * devuelve true si un control tiene un error específico y ya fue tocado
   * o se hizo submit.
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
   * Aplica un preset de duración al form sin disparar valueChanges.
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

  /** Cambio en el select de duración → actualiza campos derivados. */
  onDurationPresetChange(event: Event): void {
    const select = event.target as HTMLSelectElement | null;
    if (!select) return;

    const index = Number(select.value);
    if (Number.isNaN(index)) return;
    this.applyDurationPreset(index);
  }

  /** Aplica un preset de rating (nota + cantidad de reseñas). */
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

  /** Setea precio por hora en base al preset seleccionado. */
  onPricePerHourPreset(event: Event): void {
    const select = event.target as HTMLSelectElement | null;
    if (!select) return;

    const value = select.value === '' ? null : Number(select.value);
    this.form.patchValue({ pricePerHour: value });
  }

  /**
   * Activa / desactiva un tag en la colección selectedTags,
   * y sincroniza el campo string `tags` del formulario.
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
   * Convierte un título a slug:
   * - minúsculas
   * - sin acentos
   * - espacios / símbolos → guiones
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
   * Construye un objeto Course completo a partir del form:
   * - Genera slug si está vacío.
   * - Aplica presets de modalidad / duración.
   * - Convierte textos multilinea a arrays (stages, learnOutcomes).
   * - Normaliza tags, precios, rating y flags.
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

  /** Notifica al padre que se canceló la edición. */
  onCancel(): void {
    this.cancel.emit();
  }
}
