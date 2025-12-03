// src/app/shared/forms/tutor-form/tutor-form.ts

// ============================================================================
// TUTOR FORM COMPONENT
// ----------------------------------------------------------------------------
// Formulario de administración para crear / editar tutores.
//
// Idea general:
// - Usa un formulario reactivo (FormGroup) para manejar todos los datos de un
//   tutor: datos básicos, ubicación, instrumentos, estilos, modalidades,
//   idiomas y disponibilidad semanal.
// - Trabaja en dos modos:
//    • Crear: value = null → se genera un nuevo tutor con id basado en el nombre.
//    • Editar: value con datos → se cargan los valores existentes y se preserva el id.
// - Se encarga de:
//    • Construir el formulario con valores por defecto razonables.
//    • Cargar datos cuando cambian los @Input() (patchForm).
//    • Mapear ids de disponibilidad (availabilityIds) a una estructura semanal
//      weeklyAvailability, que es la que usa el front para mostrar los horarios.
//    • Normalizar el objeto Tutor antes de emitirlo en el submit.
// ============================================================================

import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Tutor } from '@core/models/tutor.model';

// Pequeña interfaz interna para las opciones de disponibilidad:
// id → identificador interno
// label → texto legible que verán en el formulario
interface AvailabilityOption {
  id: string;
  label: string;
}

@Component({
  selector: 'app-tutor-form',
  standalone: true,
  templateUrl: './tutor-form.html',
  imports: [CommonModule, ReactiveFormsModule],
})
/**
 * @description
 * Formulario de administración para crear y editar tutores (`Tutor`).
 *
 * Responsabilidades:
 * - Construir un `FormGroup` con todos los campos relevantes de un tutor.
 * - Soportar modo creación (`value = null`) y modo edición (`value` con datos).
 * - Mapear campos UI (selects múltiples, availabilityIds) al modelo real
 *   (`weeklyAvailability`, `instruments`, `modalities`, etc.).
 * - Emitir un `Tutor` completo y coherente al componente padre.
 *
 * @usageNotes
 * ```html
 * <app-tutor-form
 *   [value]="tutorSeleccionado"
 *   (save)="onSaveTutor($event)"
 *   (cancel)="onCancelTutor()">
 * </app-tutor-form>
 * ```
 */
export class TutorFormComponent implements OnInit, OnChanges {
  // ==========================================================================
  // INPUTS / OUTPUTS
  // ==========================================================================

  /**
   * @description
   * Estado inicial del formulario.
   *
   * - Si viene `null` → modo creación (tutor nuevo).
   * - Si viene con datos → modo edición (se patchan los valores).
   *
   * @usageNotes
   * El componente no crea ni destruye el tutor en la capa de datos, solo
   * prepara el payload y lo emite en el evento `save`.
   */
  @Input() value: Tutor | null = null;

  /**
   * @description
   * Evento que emite el `Tutor` final cuando el formulario es válido
   * y el usuario hace submit.
   *
   * @example
   * ```ts
   * onSaveTutor(tutor: Tutor) {
   *   this.tutorService.upsert(tutor);
   * }
   * ```
   */
  @Output() save = new EventEmitter<Tutor>();

  /**
   * @description
   * Evento simple para avisar al padre que se canceló la edición / creación.
   *
   * @example
   * ```html
   * <button type="button" (click)="onCancel()">Cancelar</button>
   * ```
   */
  @Output() cancel = new EventEmitter<void>();

  /**
   * @description
   * FormGroup que agrupa todos los campos del tutor.
   * Se define en `buildForm()` y se enlaza en la plantilla vía `[formGroup]`.
   */
  form!: FormGroup;

  // ============================================================
  // 1. LISTAS PREDEFINIDAS
  // ============================================================

  /**
   * @description
   * Listado de comunas de referencia dentro de la RM.
   * Se usan como opciones en un `<select>` para estandarizar ubicación
   * y facilitar filtros futuros por comuna.
   */
  communes: string[] = [
    'Santiago Centro',
    'Huechuraba',
    'Providencia',
    'Ñuñoa',
    'Las Condes',
    'La Reina',
    'Recoleta',
    'Independencia',
    'Macul',
    'Peñalolén',
    'Maipú',
    'La Florida',
    'Puente Alto',
    'San Miguel',
  ];

  /**
   * @description
   * Opciones de instrumentos:
   * - `value` → clave técnica usada en el modelo (`Tutor.instruments`).
   * - `label` → texto legible para el UI.
   *
   * Pensado para checkboxes / chips / multiselect.
   */
  instrumentOptions: { value: string; label: string }[] = [
    { value: 'guitarra-electrica', label: 'Guitarra eléctrica' },
    { value: 'guitarra-acustica', label: 'Guitarra acústica' },
    { value: 'bajo', label: 'Bajo eléctrico' },
    { value: 'teclado', label: 'Teclado / Piano' },
    { value: 'bateria', label: 'Batería' },
    { value: 'canto', label: 'Canto' },
    { value: 'ukelele', label: 'Ukelele' },
  ];

  /**
   * @description
   * Estilos musicales que puede manejar el tutor.
   * Se guardan como `string[]` en el modelo (`Tutor.styles`).
   */
  styleOptions: string[] = [
    'rock',
    'metal',
    'pop',
    'blues',
    'jazz',
    'funk',
    'indie',
    'latino',
  ];

  /**
   * @description
   * Modalidades de clases ofrecidas:
   * - `"presencial"`
   * - `"online"`
   *
   * Se combina como array (`['presencial', 'online']`) cuando aplica.
   */
  modalityOptions: string[] = ['presencial', 'online'];

  /**
   * @description
   * Valores de referencia para rating de tutor.
   * Útil para no inventar números en cada alta manual.
   */
  ratingOptions: number[] = [5, 4.8, 4.5, 4.2, 4, 3.8, 3.5];

  /**
   * @description
   * Números de reseñas predefinidos (ratingCount) para simular experiencia.
   */
  ratingCountOptions: number[] = [0, 3, 5, 10, 20, 30, 50, 100];

  /**
   * @description
   * Idiomas en los que el tutor puede hacer clases.
   * Se guardan como `string[]` (`Tutor.languages`).
   */
  languageOptions: string[] = ['Español', 'Inglés', 'Portugués'];

  /**
   * @description
   * Presets de disponibilidad para el admin.
   *
   * Cada opción:
   * - se selecciona en un `<select multiple>` (availabilityIds)
   * - luego se transforma a `weeklyAvailability` usando `mapAvailabilityFromIds`.
   */
  availabilityOptions: AvailabilityOption[] = [
    {
      id: 'lun-vie-tarde',
      label: 'Lunes a viernes · 19:00–21:00',
    },
    {
      id: 'sab-manana',
      label: 'Sábados · 10:00–13:00',
    },
    {
      id: 'lun-mie-19',
      label: 'Lunes y miércoles · 19:00',
    },
  ];

  /**
   * @description
   * Constructor del componente.
   *
   * @param fb Servicio `FormBuilder` para crear formularios reactivos.
   */
  constructor(private fb: FormBuilder) {}

  // ============================================================
  // 2. CICLO DE VIDA
  // ============================================================

  /**
   * @description
   * Hook de inicialización del componente.
   *
   * - Construye el formulario (`buildForm()`).
   * - Si viene un `Tutor` en `@Input() value`, se cargan sus datos con `patchForm`.
   */
  ngOnInit(): void {
    this.buildForm();

    if (this.value) {
      this.patchForm(this.value);
    }
  }

  /**
   * @description
   * Hook que se ejecuta cuando cambian los `@Input` del componente.
   *
   * - Si cambia `value` y el form ya existe → se actualiza el contenido con `patchForm`.
   * - Permite refrescar el formulario si el padre cambia el tutor seleccionado
   *   sin recrear el componente.
   *
   * @param changes Mapa de cambios detectados en las propiedades de entrada.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && this.form) {
      this.patchForm(this.value);
    }
  }

  // ============================================================
  // 3. CREACIÓN AND CARGA DEL FORM
  // ============================================================

  /**
   * @description
   * Define la estructura completa del `FormGroup`:
   * - Campos simples (name, commune, city, avatarUrl, etc.).
   * - Controles de tipo array para `instruments`, `styles`, `modalities`, `languages`.
   * - Valores por defecto razonables (rating, ratingCount, idioma).
   *
   * @usageNotes
   * Debe llamarse una vez en `ngOnInit` antes de usar el formulario.
   */
  private buildForm(): void {
    this.form = this.fb.group({
      // Datos básicos del tutor
      name: ['', Validators.required],

      commune: ['', Validators.required],
      city: [''],

      avatarUrl: [''],

      // Listas de strings como controles no anulables.
      instruments: this.fb.control<string[]>([], {
        validators: Validators.required,
        nonNullable: true,
      }),
      styles: this.fb.control<string[]>([], {
        validators: Validators.required,
        nonNullable: true,
      }),
      modalities: this.fb.control<string[]>([], {
        validators: Validators.required,
        nonNullable: true,
      }),

      // Tarifa por hora (CLP)
      hourlyRate: ['', Validators.required],

      // Rating inicial de referencia
      rating: [4.8],
      ratingCount: [10],

      // Descripciones
      shortDescription: ['', Validators.required],
      fullDescription: [''],

      // Experiencia y formación opcionales
      experience: [''],
      education: [''],

      // Idiomas (por defecto Español)
      languages: this.fb.control<string[]>(['Español'], {
        validators: Validators.required,
        nonNullable: true,
      }),

      // IDs de disponibilidad seleccionados desde un <select multiple>
      availabilityIds: this.fb.control<string[]>([], {
        nonNullable: true,
      }),
    });
  }

  /**
   * @description
   * Carga los datos de un `Tutor` en el formulario.
   * Aplica defaults si algunos campos vienen `undefined`.
   *
   * @param tutor Tutor a editar; si es `null`, no hace nada.
   *
   * @example
   * ```ts
   * this.patchForm(tutorSeleccionado);
   * ```
   */
  private patchForm(tutor: Tutor | null): void {
    if (!tutor) return;

    const t: any = tutor;

    this.form.patchValue({
      // Nombre y ubicación
      name: tutor.name ?? '',
      commune: t.commune ?? t.city ?? '',
      city: t.city ?? '',
      avatarUrl: tutor.avatarUrl ?? '',

      // Listas de instrumentos, estilos y modalidades
      instruments: tutor.instruments ?? [],
      styles: tutor.styles ?? [],
      modalities: tutor.modalities ?? [],

      // Tarifa por hora
      hourlyRate: t.hourlyRate ?? '',

      // Rating y cantidad de reseñas
      rating: tutor.rating ?? 4.8,
      ratingCount: t.ratingCount ?? 0,

      // Descripciones
      shortDescription: t.shortDescription ?? '',
      fullDescription: t.fullDescription ?? '',

      // Experiencia y formación
      experience: t.experience ?? '',
      education: t.education ?? '',

      // Idiomas
      languages: tutor.languages ?? ['Español'],

      // Disponibilidad:
      // aquí podrías mapear weeklyAvailability a availabilityIds si quisieras
      // rehidratarlo; por ahora se deja vacío y que el admin lo configure.
      availabilityIds: [],
    });
  }

  // ============================================================
  // 4. HELPERS DE VALIDACIÓN
  // ============================================================

  /**
   * @description
   * Helper para el template:
   * - Devuelve `true` si el control tiene el error indicado
   *   **y** ya fue tocado (`touched`).
   *
   * Esto evita mostrar errores mientras el usuario aún no interactúa.
   *
   * @param controlName Nombre del control en el formulario.
   * @param error Código de error a verificar (ej: `"required"`).
   * @returns `true` si el control tiene ese error y está `touched`.
   *
   * @example
   * ```html
   * <div *ngIf="hasError('name', 'required')">
   *   El nombre del tutor es obligatorio.
   * </div>
   * ```
   */
  hasError(controlName: string, error: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.touched && control.hasError(error));
  }

  // ============================================================
  // 5. MAPEOS / UTILIDADES
  // ============================================================

  /**
   * @description
   * Convierte una lista de `availabilityIds` en una estructura
   * `weeklyAvailability` que entiende el front.
   *
   * Cada id representa un patrón de días/horas.
   * Ids desconocidos se ignoran silenciosamente.
   *
   * @param ids Lista de ids de disponibilidad seleccionados en el formulario.
   * @returns Arreglo de objetos `{ day: string; times: string[] }`.
   *
   * @example
   * ```ts
   * const weekly = this.mapAvailabilityFromIds(['lun-vie-tarde', 'sab-manana']);
   * ```
   */
  private mapAvailabilityFromIds(ids: string[]): any[] {
    const result: any[] = [];

    for (const id of ids) {
      switch (id) {
        case 'lun-vie-tarde':
          result.push(
            { day: 'Lunes', times: ['19:00', '20:00', '21:00'] },
            { day: 'Martes', times: ['19:00', '20:00', '21:00'] },
            { day: 'Miércoles', times: ['19:00', '20:00', '21:00'] },
            { day: 'Jueves', times: ['19:00', '20:00', '21:00'] },
            { day: 'Viernes', times: ['19:00', '20:00', '21:00'] },
          );
          break;

        case 'sab-manana':
          result.push({
            day: 'Sábado',
            times: ['10:00', '11:00', '12:00', '13:00'],
          });
          break;

        case 'lun-mie-19':
          result.push(
            { day: 'Lunes', times: ['19:00'] },
            { day: 'Miércoles', times: ['19:00'] },
          );
          break;

        default:
          // Si llega un id no conocido, lo ignoramos silenciosamente.
          break;
      }
    }

    return result;
  }

  /**
   * @description
   * Genera un id/slug a partir del nombre del tutor.
   * - Minúsculas
   * - Sin acentos
   * - Espacios/símbolos → guiones
   *
   * @param text Texto base (normalmente `name`).
   * @returns Slug normalizado sin espacios ni caracteres especiales.
   *
   * @example
   * ```ts
   * const id = this.slugify('Marco Vidal – Guitarra Rock');
   * // 'marco-vidal-guitarra-rock'
   * ```
   */
  private slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // ============================================================
  // 6. SUBMIT / CANCEL
  // ============================================================

  /**
   * @description
   * Maneja los cambios de un `<select multiple>` en el template.
   *
   * - Lee las opciones seleccionadas.
   * - Actualiza el control correspondiente en el formulario.
   * - Marca el control como `dirty` y `touched` para activar validaciones.
   *
   * Se utiliza para `availabilityIds`, pero es genérico para otros multiselect.
   *
   * @param controlName Nombre del control que se debe actualizar.
   * @param event Evento `change` del `<select multiple>`.
   *
   * @example
   * ```html
   * <select multiple (change)="onMultiSelectChange('availabilityIds', $event)">
   *   ...
   * </select>
   * ```
   */
  onMultiSelectChange(controlName: string, event: Event): void {
    const select = event.target as HTMLSelectElement;
    const selectedValues = Array.from(select.selectedOptions).map(
      option => option.value,
    );

    this.form.get(controlName)?.setValue(selectedValues);
    this.form.get(controlName)?.markAsDirty();
    this.form.get(controlName)?.markAsTouched();
  }

  /**
   * @description
   * Maneja el envío del formulario.
   *
   * Flujo:
   * 1. Si el formulario es inválido:
   *    - Marca todos los controles como `touched`.
   *    - No emite nada.
   * 2. Si es válido:
   *    - Obtiene los valores crudos (`getRawValue()`).
   *    - Convierte `availabilityIds` → `weeklyAvailability`.
   *    - Construye un payload `Partial<Tutor>`, preservando datos previos
   *      si existían (modo edición).
   *    - Si no hay `id`, lo genera con `slugify(nombre)`.
   *    - Emite el `Tutor` final a través de `save`.
   */
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();

    const weeklyAvailability = this.mapAvailabilityFromIds(
      raw.availabilityIds ?? [],
    );

    const payload: Partial<Tutor> = {
      ...(this.value ?? {}),

      // Si ya existe id lo mantengo, si no, genero uno desde el nombre.
      id: this.value?.id ?? this.slugify(raw.name ?? ''),

      name: raw.name?.trim(),
      commune: raw.commune,
      city: raw.city,
      avatarUrl: raw.avatarUrl?.trim(),

      instruments: raw.instruments ?? [],
      styles: raw.styles ?? [],
      modalities: raw.modalities ?? [],

      hourlyRate: Number(raw.hourlyRate),

      rating: raw.rating ?? 0,
      ratingCount: raw.ratingCount ?? 0,

      shortDescription: raw.shortDescription,
      fullDescription: raw.fullDescription,

      experience: raw.experience,
      education: raw.education,

      languages: raw.languages ?? [],

      weeklyAvailability,
    };

    this.save.emit(payload as Tutor);
  }

  /**
   * @description
   * Notifica al padre que se canceló la operación.
   *
   * No modifica el formulario ni los datos; solo emite el evento `cancel`.
   */
  onCancel(): void {
    this.cancel.emit();
  }
}
