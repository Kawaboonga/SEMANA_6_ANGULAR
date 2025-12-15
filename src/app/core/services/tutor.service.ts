
import { Injectable, computed, signal, inject } from '@angular/core';
import {
  Tutor,
  TutorInstrument,
  TutorLevel,
  TutorStyle,
  TutorModality,
} from '@core/models/tutor.model';
import { TUTORS_MOCK } from '@core/mocks/tutor.mock';
import { HttpClient } from '@angular/common/http';

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
 * - almacenar la lista de tutores (mock/JSON + cache local),
 * - manejar filtros reactivos,
 * - exponer la lista filtrada,
 * - entregar métodos de lectura,
 * - y proveer CRUD local para el panel de administración.
 *
 * Toda la lógica de filtrado se mantiene aquí para evitar replicarla en componentes.
 *
 * @usageNotes
 * - Implementado con Signals, lo que evita store externo.
 * - Carga inicial:
 *    1) Intenta leer desde localStorage.
 *    2) Si no hay nada, carga desde /assets/data/tutors.json.
 *    3) Si falla el JSON, usa TUTORS_MOCK como fallback.
 * - create / upsert / delete simulan POST/PUT/DELETE y persisten en localStorage.
 */
export class TutorService {
  // ============================================================
  // 0) DEPENDENCIAS E INTERNA
  // ============================================================

  private readonly http = inject(HttpClient);

  /** Clave para persistir en localStorage */
  private readonly STORAGE_KEY = 'soundseeker_tutors';

  /** Ruta al JSON estático en assets */
  private readonly JSON_URL = '/assets/data/tutors.json';

  // ============================================================
  // 1) DATA LOCAL (mock/JSON + cache)
  // ============================================================

  /**
   * Lista interna de tutores en memoria.
   * Se inicializa vacía y luego se carga desde:
   * - localStorage, o
   * - JSON de assets, o
   * - TUTORS_MOCK como último recurso.
   */
  private readonly _tutors = signal<Tutor[]>([]);

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
  // ctor: carga inicial
  // ============================================================

  constructor() {
    this.loadInitialData();
  }

  // ============================================================
  // 3.1) CARGA Y PERSISTENCIA
  // ============================================================

  /**
   * Carga inicial de tutores:
   * - Primero intenta desde localStorage.
   * - Si no hay nada, carga desde el JSON de assets.
   * - Si algo falla, usa TUTORS_MOCK como fallback.
   */
  private loadInitialData(): void {
    // SSR / tests: puede no existir window
    if (typeof window === 'undefined') {
      this._tutors.set(TUTORS_MOCK);
      return;
    }

    // 1) Intentar leer desde localStorage
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Tutor[];
        this._tutors.set(parsed);
        return;
      } catch {
        // Si falla el parse, seguimos al JSON de assets
      }
    }

    // 2) Intentar desde JSON en assets
    this.http.get<Tutor[]>(this.JSON_URL).subscribe({
      next: (data) => {
        this._tutors.set(data);
        this.persistToStorage();
      },
      error: () => {
        // 3) Fallback: mock en TypeScript
        this._tutors.set(TUTORS_MOCK);
        this.persistToStorage();
      },
    });
  }

  /**
   * Persiste la lista actual de tutores en localStorage.
   * Se llama automáticamente en los métodos de CRUD local.
   */
  private persistToStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const value = JSON.stringify(this._tutors());
      localStorage.setItem(this.STORAGE_KEY, value);
    } catch {
      // Silencioso: si localStorage falla, no rompemos la app.
    }
  }

  /**
   * Borra la cache local y recarga desde el JSON de assets.
   * Útil si quieres "resetear" datos de admin al estado original del archivo.
   */
  resetFromJson(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
    this.http.get<Tutor[]>(this.JSON_URL).subscribe({
      next: (data) => {
        this._tutors.set(data);
        this.persistToStorage();
      },
      error: () => {
        this._tutors.set(TUTORS_MOCK);
        this.persistToStorage();
      },
    });
  }

  // ============================================================
  // 4) ACCIONES SOBRE EL FILTRO
  // ============================================================

  setFilter(partial: Partial<TutorFilter>) {
    this._filter.update((f) => ({ ...f, ...partial }));
  }

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

  /** Devuelve la lista completa de tutores (sin filtros). */
  getAll(): Tutor[] {
    return [...this._tutors()];
  }

  /**
   * Busca un tutor por su ID.
   *
   * @param id ID del tutor
   * @returns Tutor encontrado o undefined si no existe
   */
  getTutorById(id: string): Tutor | undefined {
    return this._tutors().find((t) => t.id === id);
  }

  // ============================================================
  // 6) CRUD LOCAL (simulación POST/PUT/DELETE)
  // ============================================================

  /**
   * Crea un tutor nuevo usando los datos del formulario.
   * Equivale a simular un POST sobre el JSON.
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
    this.persistToStorage();
    return newTutor;
  }

  /**
   * Inserta o actualiza un tutor.
   * - Si no existe → se agrega (simula POST).
   * - Si existe → se actualiza (simula PUT).
   *
   * @param tutor tutor completo a insertar/actualizar
   */
  upsertTutor(tutor: Tutor): void {
    this._tutors.update((list) => {
      const index = list.findIndex((t) => t.id === tutor.id);
      if (index === -1) {
        const updated = [...list, tutor];
        return updated;
      }
      const copy = [...list];
      copy[index] = { ...copy[index], ...tutor };
      return copy;
    });
    this.persistToStorage();
  }

  /**
   * Elimina un tutor por ID.
   * Equivale a simular un DELETE sobre el JSON.
   *
   * @param id ID del tutor
   */
  deleteTutor(id: string): void {
    this._tutors.update((list) => list.filter((t) => t.id !== id));
    this.persistToStorage();
  }
}
