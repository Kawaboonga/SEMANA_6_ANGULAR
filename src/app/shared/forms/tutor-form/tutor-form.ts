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
export class TutorFormComponent implements OnInit, OnChanges {
  // ==========================================================================
  // INPUTS / OUTPUTS
  // ==========================================================================

  /**
   * value:
   *   - Si viene null → modo creación (tutor nuevo).
   *   - Si viene con datos → modo edición.
   * Se usa como "estado inicial" del formulario.
   */
  @Input() value: Tutor | null = null;

  /**
   * save:
   *   Emite el Tutor final cuando el formulario es válido y se hace submit.
   */
  @Output() save = new EventEmitter<Tutor>();

  /**
   * cancel:
   *   Evento simple para avisar al padre que se canceló la edición / creación.
   */
  @Output() cancel = new EventEmitter<void>();

  /**
   * form:
   *   FormGroup que agrupa todos los campos del tutor.
   *   Se define en buildForm() y se usa en el template con [formGroup].
   */
  form!: FormGroup;

  // ============================================================
  // 1. LISTAS PREDEFINIDAS
  // ============================================================

  /**
   * communes:
   *   Listado de comunas de referencia dentro de la RM.
   *   Se usan como opciones en un <select>, para estandarizar la ubicación
   *   y permitir filtros futuros (por comuna).
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
   * instrumentOptions:
   *   Cada opción tiene un value "técnico" (para el modelo)
   *   y un label legible para mostrar en el UI.
   *   Se piensa para chips / checkboxes / selects múltiples.
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
   * styleOptions:
   *   Estilos musicales que puede manejar el tutor.
   *   Se almacenan como strings simples en un array.
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
   * modalityOptions:
   *   Modalidades de clases ofrecidas:
   *   - presencial
   *   - online
   *   Se maneja como array de string, lo que facilita usar
   *   checkboxes múltiples.
   */
  modalityOptions: string[] = ['presencial', 'online'];

  /**
   * ratingOptions:
   *   Valores de referencia para rating de tutor.
   *   Pensado para no estar inventando números a cada rato
   *   cuando se cargan tutores nuevos.
   */
  ratingOptions: number[] = [5, 4.8, 4.5, 4.2, 4, 3.8, 3.5];

  /**
   * ratingCountOptions:
   *   Números de reseñas predefinidos para simular experiencia.
   */
  ratingCountOptions: number[] = [0, 3, 5, 10, 20, 30, 50, 100];

  /**
   * languageOptions:
   *   Idiomas en los que el tutor puede hacer clases.
   *   Se guardan como array de strings.
   */
  languageOptions: string[] = ['Español', 'Inglés', 'Portugués'];

  /**
   * availabilityOptions:
   *   Presets de disponibilidad que el admin puede marcar.
   *   Cada opción se convierte luego en un conjunto de días/horas
   *   más detallado, usando mapAvailabilityFromIds().
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

  constructor(private fb: FormBuilder) {}

  // ============================================================
  // 2. CICLO DE VIDA
  // ============================================================

  /**
   * ngOnInit:
   *   - Construye el formulario (buildForm).
   *   - Si viene un tutor en @Input() value, se hace patchForm
   *     para entrar directo en modo edición.
   */
  ngOnInit(): void {
    this.buildForm();

    if (this.value) {
      this.patchForm(this.value);
    }
  }

  /**
   * ngOnChanges:
   *   - Se ejecuta cuando cambian los inputs del componente.
   *   - Si cambia `value` y el form ya está construido, se actualiza
   *     el contenido del formulario con patchForm().
   *   Esto permite refrescar el formulario si el padre cambia el tutor
   *   seleccionado sin recrear el componente.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && this.form) {
      this.patchForm(this.value);
    }
  }

  // ============================================================
  // 3. CREACIÓN Y CARGA DEL FORM
  // ============================================================

  /**
   * buildForm:
   *   Define la estructura completa del FormGroup:
   *   - Campos simples (name, city, avatarUrl, etc.).
   *   - Controles de tipo array para instruments, styles, modalities, languages.
   *   - Valores por defecto razonables (ej: rating, ratingCount, languages).
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
   * patchForm:
   *   Carga los datos de un Tutor en el formulario.
   *   Se preocupa de aplicar defaults si algunos campos vienen undefined.
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
   * hasError:
   *   Helper para usar en el template:
   *   - Devuelve true si el control tiene el error indicado
   *     y además ya fue tocado.
   *   Esto evita mostrar errores mientras el usuario aún no interactúa.
   */
  hasError(controlName: string, error: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.touched && control.hasError(error));
  }

  // ============================================================
  // 5. MAPEOS / UTILIDADES
  // ============================================================

  /**
   * mapAvailabilityFromIds:
   *   Convierte una lista de ids de disponibilidad (availabilityIds)
   *   en una estructura weeklyAvailability que entiende el front.
   *
   *   Cada id representa un patrón de días/horas.
   *   Si llega un id desconocido, se ignora (para no romper nada).
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
   * slugify:
   *   Genera un id/slug a partir del nombre del tutor.
   *   Se pasa a minúsculas, se eliminan acentos y se reemplazan
   *   espacios/símbolos por guiones.
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
   * onMultiSelectChange:
   *   Maneja los cambios de un <select multiple> en el template.
   *   - Lee las opciones seleccionadas.
   *   - Actualiza el control correspondiente en el form.
   *   - Marca el control como dirty y touched para activar validaciones.
   *
   *   Se utiliza para availabilityIds, pero el método es genérico
   *   por si quisieras reutilizarlo en otros selects múltiples.
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
   * onSubmit:
   *   - Valida el formulario.
   *   - Si es inválido → marca todo como touched y no hace nada más.
   *   - Si es válido:
   *       • Obtiene los valores en bruto (getRawValue).
   *       • Convierte availabilityIds a weeklyAvailability.
   *       • Construye un payload Partial<Tutor> manteniendo los datos
   *         previos si existían (modo edición).
   *       • Si no hay id, lo genera usando slugify(nombre).
   *       • Emite el tutor final a través del EventEmitter save.
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
   * onCancel:
   *   Notifica al padre que se canceló la operación.
   *   No toca el formulario ni los datos; solo emite el evento.
   */
  onCancel(): void {
    this.cancel.emit();
  }
}
