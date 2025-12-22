import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Course,
  CourseDifficulty,
  CourseModality,
} from '@core/models/course.model';
import { CarouselItem } from '@shared/components/carousel/carousel.types';

export interface CourseFilter {
  search?: string;
  difficulty?: CourseDifficulty | 'todos';
  modality?: CourseModality | 'todos';
  level?: string | 'todos';
  tutorId?: string | 'todos';
  minPrice?: number | null;
  maxPrice?: number | null;
  sortByPrice?: 'asc' | 'desc' | null;
  sortByRating?: 'asc' | 'desc' | null;
}

/**
 * Servicio encargado de manejar los cursos del proyecto.
 *
 * - Fuente principal: JSON remoto publicado en GitHub Pages (/JSON_API/courses.json)
 * - Fallback: localStorage (si existiera data previa)
 * - Fallback final: mock mínimo (para no dejar la UI en blanco)
 *
 * @usageNotes
 * - En GitHub Pages, las rutas relativas pueden fallar en rutas hijas como /cursos.
 *   Por eso el JSON_URL debe ser ABSOLUTO (empieza con "/").
 */
@Injectable({
  providedIn: 'root',
})
export class CourseService {
  // ============================================================
  // 0) DEPENDENCIAS Y CONSTANTES
  // ============================================================

  private readonly http = inject(HttpClient);

  /** localStorage key */
  private readonly STORAGE_KEY = 'soundseeker_courses';

  /**
   * JSON remoto (GitHub Pages)
   * IMPORTANTE: ruta absoluta para que funcione en /cursos, /cursos/:slug, etc.
   */
private readonly JSON_URL = 'https://kawaboonga.github.io/JSON_API/courses.json?v=' + Date.now();

  /**
   * Mock aislado — solo se usa como fallback,
   * NUNCA como fuente primaria.
   */
  private get fallbackMock(): Course[] {
    return [
      {
        id: 'curso-guitarra-rock',
        slug: 'curso-intensivo-guitarra-rock',
        title: 'Curso intensivo de guitarra rock',
        tutorId: 'marco-vidal',
        tutorName: 'Marco Vidal',
        difficulty: 'Intermedio',
        level: 'Intermedio',
        duration: '16 h · 8 clases',
        durationHours: 16,
        totalLessons: 8,
        lessonsCount: 8,
        shortDescription: 'Domina riffs, power chords y solos básicos de rock.',
        description:
          'En este curso trabajarás repertorio real de rock, técnica de púa, palm mute, power chords y construcción de solos sencillos.',
        imageUrl: '/assets/img/course/curso-guitarra-e2.jpg',
        rating: 4.8,
        ratingCount: 32,
        modalities: ['Presencial', 'Online'],
        stages: [
          'Fundamentos de palm mute',
          'Riffs clásicos',
          'Power chords y progresiones',
          'Introducción a solos',
        ],
        learnOutcomes: [
          'Tocar riffs con buen timing.',
          'Entender progresiones de rock.',
          'Improvisar solos sencillos.',
        ],
        reviews: [],
        showInCarousel: true,
        isFeatured: true,
        isOffer: false,
        isNew: true,
        isActive: true,
        priceCLP: 89990,
        price: 89990,
        priceLabel: '$89.990',
      },
    ];
  }

  // ============================================================
  // 1) SIGNALS: cursos + filtro
  // ============================================================

  private readonly _courses = signal<Course[]>([]);
  readonly courses = this._courses.asReadonly();

  private readonly _filter = signal<CourseFilter>({
    difficulty: 'todos',
    modality: 'todos',
    level: 'todos',
    tutorId: 'todos',
    sortByPrice: null,
    sortByRating: null,
  });

  readonly filter = this._filter.asReadonly();

  // ============================================================
  // 2) LISTA FILTRADA
  // ============================================================

  readonly filteredCourses = computed(() => {
    const f = this._filter();
    let list = [...this._courses()];

    if (f.search) {
      const q = f.search.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.tutorName.toLowerCase().includes(q) ||
          c.shortDescription.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q),
      );
    }

    if (f.difficulty && f.difficulty !== 'todos') {
      list = list.filter((c) => c.difficulty === f.difficulty);
    }

    if (f.modality && f.modality !== 'todos') {
      list = list.filter((c) =>
        (c.modalities ?? []).includes(f.modality as CourseModality),
      );
    }

    if (f.level && f.level !== 'todos') {
      list = list.filter((c) => c.level === f.level);
    }

    if (f.tutorId && f.tutorId !== 'todos') {
      list = list.filter((c) => c.tutorId === f.tutorId);
    }

    if (f.minPrice != null) {
      list = list.filter((c) => (c.priceCLP ?? c.price ?? 0) >= f.minPrice!);
    }

    if (f.maxPrice != null) {
      list = list.filter((c) => (c.priceCLP ?? c.price ?? 0) <= f.maxPrice!);
    }

    if (f.sortByPrice) {
      list.sort((a, b) => {
        const pa = a.priceCLP ?? a.price ?? 0;
        const pb = b.priceCLP ?? b.price ?? 0;
        return f.sortByPrice === 'asc' ? pa - pb : pb - pa;
      });
    }

    if (f.sortByRating) {
      list.sort((a, b) => {
        const ra = a.rating ?? 0;
        const rb = b.rating ?? 0;
        return f.sortByRating === 'asc' ? ra - rb : rb - ra;
      });
    }

    return list;
  });

  // ============================================================
  // 3) CONSTRUCTOR: carga inicial
  // ============================================================

  constructor() {
    this.loadInitialData();
  }

  /**
   * Estrategia:
   * 1) intenta localStorage
   * 2) intenta JSON remoto (robusto, parseando como texto)
   * 3) fallback mock
   */
  private loadInitialData(): void {
    // 1) localStorage
    const fromStorage = this.loadFromStorage();
    if (fromStorage?.length) {
      this._courses.set(fromStorage);
    }

    // 2) JSON remoto (si llega, reemplaza)
    this.loadFromRemoteJson();

    // 3) si quedamos vacíos (y el remoto falla), aseguramos fallback
    if (this._courses().length === 0) {
      this._courses.set(this.fallbackMock);
      this.persist();
    }
  }

  /**
   * Carga desde JSON remoto.
   *
   * @important
   * - Usamos responseType:'text' + JSON.parse para evitar casos donde GH Pages
   *   devuelve HTML (por ejemplo 404 que retorna index.html).
   */
  private loadFromRemoteJson(): void {
    this.http
      .get(this.JSON_URL, { responseType: 'text' })
      .subscribe({
        next: (txt) => {
          try {
            const parsed = JSON.parse(txt);
            const list = Array.isArray(parsed) ? (parsed as Course[]) : [];

            this._courses.set(list);
            this.persist();

            // Debug útil
            console.log(
              '[CourseService] Cursos cargados desde JSON remoto:',
              list.length,
              'URL:',
              this.JSON_URL,
            );
          } catch (e) {
            console.error(
              '[CourseService] Error parseando JSON remoto. ¿Está devolviendo HTML?',
              e,
              'URL:',
              this.JSON_URL,
              'Preview:',
              (txt ?? '').slice(0, 120),
            );
          }
        },
        error: (err) => {
          console.error(
            '[CourseService] Error cargando JSON remoto:',
            err,
            'URL:',
            this.JSON_URL,
          );
        },
      });
  }

  private loadFromStorage(): Course[] | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Course[];
      return Array.isArray(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  private persist(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._courses()));
    } catch {}
  }

  // ============================================================
  // 4) FILTROS
  // ============================================================

  setFilter(partial: Partial<CourseFilter>): void {
    this._filter.update((f) => ({ ...f, ...partial }));
  }

  resetFilter(): void {
    this._filter.set({
      difficulty: 'todos',
      modality: 'todos',
      level: 'todos',
      tutorId: 'todos',
      search: '',
      minPrice: null,
      maxPrice: null,
      sortByPrice: null,
      sortByRating: null,
    });
  }

  // ============================================================
  // 5) LECTURAS
  // ============================================================

  getAll(): Course[] {
    return [...this._courses()];
  }

  getBySlug(slug: string): Course | undefined {
    return this._courses().find((c) => c.slug === slug);
  }

  getCourseBySlug(slug: string) {
    return this.getBySlug(slug);
  }

  getByTutorId(tutorId: string, exceptId?: string): Course[] {
    return this._courses().filter((c) => c.tutorId === tutorId && c.id !== exceptId);
  }

  getCoursesByTutor(tutorId: string, exceptId?: string) {
    return this.getByTutorId(tutorId, exceptId);
  }

  // ============================================================
  // 6) CARRUSEL
  // ============================================================

  getFeaturedCoursesForCarousel(limit = 8): CarouselItem[] {
    return this._courses()
      .filter((c) => c.isFeatured)
      .slice(0, limit)
      .map((c) => ({
        id: c.id,
        type: 'course',
        title: c.title,
        subtitle: c.tutorName,
        description: c.shortDescription,
        imageUrl: c.imageUrl || 'assets/img/courses/default.jpg',
        price: c.priceCLP ?? c.price ?? 0,
        rating: c.rating,
        dateLabel: c.duration,
        ctaLabel: 'Ver curso',
        ctaLink: `/cursos/${c.slug}`,
      }));
  }

  // ============================================================
  // 7) CRUD ADMIN + persistencia
  // ============================================================

  addCourse(course: Course): void {
    const newCourse = {
      ...course,
      id: course.id || `course-${Date.now()}`,
    };
    this._courses.update((list) => [...list, newCourse]);
    this.persist();
  }

  updateCourse(updated: Course): void {
    this._courses.update((list) => {
      const index = list.findIndex((c) => c.id === updated.id);
      if (index === -1) return list;
      const copy = [...list];
      copy[index] = { ...updated };
      return copy;
    });
    this.persist();
  }

  deleteCourse(id: string): void {
    this._courses.update((list) => list.filter((c) => c.id !== id));
    this.persist();
  }

  /**
   * Restablece los cursos desde el JSON original (remoto).
   * Útil para un botón "Restablecer cursos" en el panel de Admin.
   */
  resetFromJson(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
    this._courses.set([]);
    this.loadFromRemoteJson();
  }
}
