
import { Injectable } from '@angular/core';
import { Course } from '@core/models/course.model';
import { COURSES_MOCK } from '@core/mocks/course.mock';
import { CarouselItem } from '@shared/components/carousel/carousel.types';

@Injectable({
  providedIn: 'root',
})
/**
 * Servicio encargado de manejar los cursos del proyecto.
 *
 * Por ahora trabaja con un mock local (`COURSES_MOCK`), pero está pensado
 * para conectarse a una API real en cualquier momento.
 *
 * Se usa en:
 * - listados generales de cursos,
 * - la ficha de detalle `/cursos/:slug`,
 * - módulos de tutor (cursos impartidos por un profesor),
 * - el carrusel del home,
 * - el panel de Administración (CRUD básico local).
 *
 * @usageNotes
 * - Todos los métodos retornan arreglos puros (sin mutar la data original).
 * - `getFeaturedCoursesForCarousel()` mapea cursos al modelo genérico
 *   `CarouselItem` para reutilizar el componente del carrusel.
 * - Los métodos alias (`getCourseBySlug`, `getCoursesByTutor`) existen
 *   porque distintos componentes los llaman de forma distinta.
 *
 * @example
 * const cursos = this.courseService.getAll();
 *
 * @example
 * const curso = this.courseService.getBySlug('curso-guitarra-rock');
 */
export class CourseService {
  // ============================================================
  // 1) DATA LOCAL DE CURSOS (mock)
  // ============================================================

  /**
   * Lista completa de cursos, almacenada temporalmente en memoria.
   * Más adelante puede venir desde JSON o servicios HTTP.
   */
  private courses: Course[] = COURSES_MOCK;

  // ============================================================
  // 2) MÉTODOS PÚBLICOS (LECTURA BÁSICA)
  // ============================================================

  /**
   * Retorna todos los cursos tal cual están en memoria.
   * Usado en listados y en el panel del administrador.
   *
   * @returns Course[]
   */
  getAll(): Course[] {
    return this.courses;
  }

  /**
   * Busca un curso por su slug (ruta limpia).
   * Se usa en la página de detalle `/cursos/:slug`.
   *
   * @param slug slug del curso
   * @returns Course | undefined
   *
   * @example
   * const curso = this.courseService.getBySlug('guitarra-rock');
   */
  getBySlug(slug: string): Course | undefined {
    return this.courses.find((c) => c.slug === slug);
  }

  /**
   * Alias de `getBySlug`, usado en algunos componentes como el breadcrumb.
   *
   * @param slug slug del curso
   * @returns Course | undefined
   */
  getCourseBySlug(slug: string): Course | undefined {
    return this.getBySlug(slug);
  }

  /**
   * Devuelve todos los cursos impartidos por un tutor.
   * Se puede excluir un curso específico (útil para “Otros cursos del tutor”).
   *
   * @param tutorId ID del tutor
   * @param exceptId ID opcional para excluir un curso puntual
   * @returns Course[]
   *
   * @example
   * const cursosDelTutor = this.courseService.getByTutorId('marco-vidal', 'curso-rock');
   */
  getByTutorId(tutorId: string, exceptId?: string): Course[] {
    return this.courses.filter(
      (c) => c.tutorId === tutorId && c.id !== exceptId,
    );
  }

  /**
   * Alias de `getByTutorId`, para casos donde se llama con otro nombre.
   */
  getCoursesByTutor(tutorId: string, exceptId?: string): Course[] {
    return this.getByTutorId(tutorId, exceptId);
  }

  // ============================================================
  // 3) ARMADO DE DATA PARA EL CARRUSEL
  // ============================================================

  /**
   * Mapea los cursos destacados (`isFeatured`) al modelo genérico `CarouselItem`,
   * permitiendo reutilizar el carrusel global del home.
   *
   * @param limit cantidad máxima a mostrar (por defecto 8)
   * @returns CarouselItem[]
   *
   * @usageNotes
   * - Reutiliza `duration` como `dateLabel` para mostrar texto secundario.
   * - Si el curso no tiene imagen, usa un fallback local.
   *
   * @example
   * const destacados = this.courseService.getFeaturedCoursesForCarousel(4);
   */
  getFeaturedCoursesForCarousel(limit = 8): CarouselItem[] {
    return this.courses
      .filter((c) => c.isFeatured)
      .slice(0, limit)
      .map<CarouselItem>((c) => ({
        id: c.id,
        type: 'course',
        title: c.title,
        subtitle: c.tutorName,
        description: c.shortDescription,
        imageUrl: c.imageUrl || 'assets/img/courses/default.jpg',
        price: c.priceCLP,
        rating: c.rating,
        dateLabel: c.duration,
        ctaLabel: 'Ver curso',
        ctaLink: `/cursos/${c.slug}`,
      }));
  }

  // ============================================================
  // 4) ADMIN (CRUD LOCAL)
  // ============================================================

  /**
   * Agrega un nuevo curso a la lista local.
   *
   * @param course nuevo curso
   *
   * @example
   * this.courseService.addCourse(formValue);
   */
  addCourse(course: Course): void {
    this.courses.push(course);
  }

  /**
   * Actualiza un curso existente basado en su ID.
   *
   * @param updated curso actualizado
   *
   * @example
   * this.courseService.updateCourse(cursoEditado);
   */
  updateCourse(updated: Course): void {
    const index = this.courses.findIndex((c) => c.id === updated.id);
    if (index !== -1) {
      this.courses[index] = { ...updated };
    }
  }

  /**
   * Elimina un curso por ID.
   *
   * @param id ID del curso a eliminar
   *
   * @example
   * this.courseService.deleteCourse('curso-guitarra-rock');
   */
  deleteCourse(id: string): void {
    this.courses = this.courses.filter((c) => c.id !== id);
  }
}
