import { Injectable, computed, signal } from '@angular/core';
import {Tutor, TutorInstrument, TutorLevel, TutorStyle, TutorModality,} from '@core/models/tutor.model';
import { TUTORS_MOCK } from '@core/mocks/tutor.mock';

/**
 * Filtros disponibles para el buscador de tutores.
 *
 * Todo es opcional para poder combinar filtros libremente desde la UI:
 * instrumento, nivel, estilo, modalidad, búsqueda de texto,
 * rango de precio y ordenamiento.
 *
 * @usageNotes
 * - Se usa en los selectores, inputs y controles del buscador de tutores.
 * - `'todos'` significa “sin filtro”.
 */
export interface TutorFilter {
  instrument?: TutorInstrument | 'todos';
  level?: TutorLevel | 'todos';
  style?: TutorStyle | 'todos';
  modality?: TutorModality | 'todos';
  search?: string;
  minPrice?: number | null;
  maxPrice?: number | null;
  sortByPrice?: 'asc' | 'desc' | null;
}

@Injectable({ providedIn: 'root' })
/**
 * Servicio principal para manejar tutores.
 *
 * Se encarga de:
 * - almacenar la lista de tutores (mock por ahora),
 * - manejar filtros reactivos,
 * - exponer la lista filtrada,
 * - entregar métodos de lectura,
 * - y proveer CRUD local para el panel de administración.
 *
 * Toda la lógica de filtrado se mantiene aquí para evitar replicarla en componentes.
 *
 * @usageNotes
 * - Implementado con Signals, lo que evita store externo.
 * - En el futuro puede reemplazarse `_tutors` por una llamada HTTP real.
 * - `filteredTutors` siempre refleja el estado actual del filtro.
 */
export class TutorService {
  // ============================================================
  // 1) DATA LOCAL (mock)
  // ============================================================

  /**
   * Lista interna de tutores en memoria (por ahora mock local).
   * Más adelante puede conectarse a una API externa.
   */
  private readonly _tutors = signal<Tutor[]>(TUTORS_MOCK);

  // ============================================================
  // 2) ESTADO DE FILTRO
  // ============================================================

  /**
   * Estado reactivo para los filtros del buscador de tutores.
   * Se inicializa mostrando todo.
   */
  private readonly _filter = signal<TutorFilter>({
    instrument: 'todos',
    level: 'todos',
    style: 'todos',
    modality: 'todos',
    sortByPrice: null,
  });

  // ============================================================
  // 3) SELECTORES (readonly)
  // ============================================================

  /** Lista completa de tutores (solo lectura). */
  readonly tutors = this._tutors.asReadonly();

  /** Estado completo del filtro (solo lectura). */
  readonly filter = this._filter.asReadonly();

  /**
   * Lista de tutores filtrada según el estado actual.
   * Esta propiedad concentra TODA la lógica de filtros y orden.
   *
   * @returns Tutor[] filtrados dinámicamente.
   */
  readonly filteredTutors = computed(() => {
    const f = this._filter();
    let list = [...this._tutors()];

    // Instrumento
    if (f.instrument && f.instrument !== 'todos') {
      list = list.filter((t) => t.instruments.includes(f.instrument as any));
    }

    // Nivel
    if (f.level && f.level !== 'todos') {
      list = list.filter((t) => t.levelRange.includes(f.level as any));
    }

    // Estilo
    if (f.style && f.style !== 'todos') {
      list = list.filter((t) => t.styles.includes(f.style as any));
    }

    // Modalidad
    if (f.modality && f.modality !== 'todos') {
      list = list.filter((t) => t.modalities.includes(f.modality as any));
    }

    // Precio mínimo
    if (f.minPrice != null) {
      list = list.filter((t) => t.hourlyRate >= f.minPrice!);
    }

    // Precio máximo
    if (f.maxPrice != null) {
      list = list.filter((t) => t.hourlyRate <= f.maxPrice!);
    }

    // Búsqueda general
    if (f.search && f.search.trim()) {
      const q = f.search.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.shortDescription.toLowerCase().includes(q) ||
          t.fullDescription.toLowerCase().includes(q),
      );
    }

    // Orden por precio
    if (f.sortByPrice === 'asc') {
      list.sort((a, b) => a.hourlyRate - b.hourlyRate);
    } else if (f.sortByPrice === 'desc') {
      list.sort((a, b) => b.hourlyRate - a.hourlyRate);
    }

    return list;
  });

  // ============================================================
  // 4) ACCIONES SOBRE EL FILTRO
  // ============================================================

  /**
   * Actualiza parcialmente el filtro.
   * Ideal para cambios desde selectores, inputs, chips, sliders, etc.
   *
   * @param partial valores parciales a mezclar con el filtro actual.
   *
   * @example
   * this.tutorService.setFilter({ instrument: 'guitarra-electrica' });
   */
  setFilter(partial: Partial<TutorFilter>) {
    this._filter.update((f) => ({ ...f, ...partial }));
  }

  /**
   * Resetea todos los filtros a su estado inicial.
   *
   * @example
   * this.tutorService.resetFilter();
   */
  resetFilter() {
    this._filter.set({
      instrument: 'todos',
      level: 'todos',
      style: 'todos',
      modality: 'todos',
      search: '',
      minPrice: null,
      maxPrice: null,
      sortByPrice: null,
    });
  }

  // ============================================================
  // 5) MÉTODOS DE LECTURA
  // ============================================================

  /**
   * Devuelve la lista completa de tutores.
   * Útil para admin o procesos que no involucran filtros.
   *
   * @returns Tutor[]
   */
  getAll(): Tutor[] {
    return [...this._tutors()];
  }

  /**
   * Busca un tutor por su ID.
   *
   * @param id ID del tutor
   * @returns Tutor encontrado o undefined si no existe
   *
   * @example
   * const tutor = this.tutorService.getTutorById('marco-vidal');
   */
  getTutorById(id: string): Tutor | undefined {
    return this._tutors().find((t) => t.id === id);
  }

  // ============================================================
  // 6) CRUD LOCAL (para admin)
  // ============================================================

  /**
   * Crea un tutor nuevo usando los datos del formulario.
   * El ID se genera automáticamente con crypto.randomUUID().
   *
   * @param tutorData datos del tutor sin ID
   * @returns Tutor creado
   */
  createTutor(tutorData: Omit<Tutor, 'id'>): Tutor {
    const newTutor: Tutor = {
      ...tutorData,
      id: crypto.randomUUID(),
    };

    this._tutors.update((list) => [...list, newTutor]);
    return newTutor;
  }

  /**
   * Inserta o actualiza un tutor.
   * - Si no existe → se agrega.
   * - Si existe → se actualiza.
   *
   * @param tutor tutor completo a actualizar
   */
  upsertTutor(tutor: Tutor): void {
    this._tutors.update((list) => {
      const index = list.findIndex((t) => t.id === tutor.id);
      if (index === -1) {
        return [...list, tutor];
      }
      const copy = [...list];
      copy[index] = { ...copy[index], ...tutor };
      return copy;
    });
  }

  /**
   * Elimina un tutor por ID.
   *
   * @param id ID del tutor
   * @example
   * this.tutorService.deleteTutor('marco-vidal');
   */
  deleteTutor(id: string): void {
    this._tutors.update((list) => list.filter((t) => t.id !== id));
  }
}
