import { Injectable, computed, signal } from '@angular/core';
import { Tutor, TutorInstrument, TutorLevel, TutorStyle, TutorModality,} from '@core/models/tutor.model';
import { TUTORS_MOCK } from '@core/mocks/tutor.mock';

// Filtros disponibles para el buscador de tutores.
// Todo es opcional para poder combinar libremente.
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
export class TutorService {
  // ============================================================
  // 1) DATA LOCAL (mock) - FUTURO: API / JSON EXTERNO
  // ============================================================
  // Uso un signal para mantener la lista de tutores en memoria.
  // Por ahora es mock local, pero más adelante se puede conectar a una API.

  private readonly _tutors = signal<Tutor[]>(TUTORS_MOCK);


  // ============================================================
  // 2) STATE DE FILTRO
  // ============================================================
  // Estado reactivo para los filtros del buscador de tutores.
  // Dejo valores por defecto para mostrar TODO al inicio.
  private readonly _filter = signal<TutorFilter>({
    instrument: 'todos',
    level: 'todos',
    style: 'todos',
    modality: 'todos',
    sortByPrice: null,
  });

  // ============================================================
  // 3) SELECTORES (signals readonly)
  // ============================================================
  // Exponer los signals como solo lectura para no romper el encapsulamiento.
  readonly tutors = this._tutors.asReadonly();
  readonly filter = this._filter.asReadonly();

  // Lista de tutores ya filtrada según el estado actual de _filter.
  // Toda la lógica de filtros y orden queda concentrada aquí.
  readonly filteredTutors = computed(() => {
    const f = this._filter();
    let list = [...this._tutors()];

    // Filtro por instrumento si hay uno seleccionado distinto de "todos".
    if (f.instrument && f.instrument !== 'todos') {
      list = list.filter((t) => t.instruments.includes(f.instrument as any));
    }

    // Filtro por nivel (principiante, intermedio, avanzado).
    if (f.level && f.level !== 'todos') {
      list = list.filter((t) => t.levelRange.includes(f.level as any));
    }

    // Filtro por estilo (rock, pop, jazz, etc.).
    if (f.style && f.style !== 'todos') {
      list = list.filter((t) => t.styles.includes(f.style as any));
    }

    // Filtro por modalidad (online, presencial, híbrido).
    if (f.modality && f.modality !== 'todos') {
      list = list.filter((t) => t.modalities.includes(f.modality as any));
    }

    // Filtro por rango mínimo de precio.
    if (f.minPrice != null) {
      list = list.filter((t) => t.hourlyRate >= f.minPrice!);
    }

    // Filtro por rango máximo de precio.
    if (f.maxPrice != null) {
      list = list.filter((t) => t.hourlyRate <= f.maxPrice!);
    }

    // Búsqueda de texto libre (nombre + descripciones).
    if (f.search && f.search.trim()) {
      const q = f.search.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.shortDescription.toLowerCase().includes(q) ||
          t.fullDescription.toLowerCase().includes(q),
      );
    }

    // Ordenamiento por precio si está definido.
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
  // Actualiza parcialmente el filtro.
  // Ideal para ir aplicando cambios desde distintos controles (selects, inputs, etc.).
  setFilter(partial: Partial<TutorFilter>) {
    this._filter.update((f) => ({ ...f, ...partial }));
  }

  // Resetea todos los filtros a sus valores iniciales.
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
  // 5) MÉTODOS DE LECTURA (para admin / detalle)
  // ============================================================
  // Devuelve una copia de la lista completa.
  // Útil para el panel de admin o lógica que no necesita filtros.
  getAll(): Tutor[] {
    return [...this._tutors()];
  }

  // Busca un tutor específico por su ID.
  // Usado en páginas de detalle u operaciones puntuales.
  getTutorById(id: string): Tutor | undefined {
    return this._tutors().find((t) => t.id === id);
  }

  // ============================================================
  // 6) CRUD LOCAL PARA EL PANEL DE ADMIN
  // ============================================================
  // Crea un nuevo tutor a partir de los datos del formulario.
  // El ID se genera aquí mismo usando crypto.randomUUID().
  createTutor(tutorData: Omit<Tutor, 'id'>): Tutor {
    const newTutor: Tutor = {
      ...tutorData,
      id: crypto.randomUUID(),
    };

    this._tutors.update((list) => [...list, newTutor]);
    return newTutor;
  }

  // Inserta o actualiza un tutor:
  // - Si no existe → lo agrega.
  // - Si existe → actualiza sus datos.
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

  // Elimina un tutor por ID de la lista local.
  deleteTutor(id: string): void {
    this._tutors.update((list) => list.filter((t) => t.id !== id));
  }
}
