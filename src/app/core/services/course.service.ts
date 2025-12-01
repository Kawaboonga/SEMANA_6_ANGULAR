// src/app/core/services/course.service.ts

import { Injectable } from '@angular/core';
import { Course } from '@core/models/course.model';
import { COURSES_MOCK } from '@core/mocks/course.mock';
import { CarouselItem } from '@shared/components/carousel/carousel.types';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  // ============================================================
  // 1) DATA LOCAL DE CURSOS (mock)
  // ============================================================
  // Por ahora todos los cursos viven acá en memoria.
  // Más adelante esto se puede mover a un JSON externo o a una API real.
  private courses: Course[] = COURSES_MOCK;

  // ============================================================
  // 2) MÉTODOS PÚBLICOS (LECTURA BÁSICA)
  // ============================================================

  // Devuelve todos los cursos tal cual están en memoria.
  // Se usa para listados generales o para el Admin.
  getAll(): Course[] {
    return this.courses;
  }

  // Nombre que usa curso-detail.ts para resolver la ruta /cursos/:slug
  getBySlug(slug: string): Course | undefined {
    return this.courses.find((c) => c.slug === slug);
  }

  // Alias utilizado por otros componentes (por ejemplo el breadcrumb).
  getCourseBySlug(slug: string): Course | undefined {
    return this.getBySlug(slug);
  }

  // Devuelve todos los cursos de un tutor, con la opción de excluir uno
  // (por ejemplo, para no repetir el curso actual en "Más cursos de este tutor").
  getByTutorId(tutorId: string, exceptId?: string): Course[] {
    return this.courses.filter(
      (c) => c.tutorId === tutorId && c.id !== exceptId,
    );
  }

  // Alias del anterior, por si en algún punto lo llamas con otro nombre.
  getCoursesByTutor(tutorId: string, exceptId?: string): Course[] {
    return this.getByTutorId(tutorId, exceptId);
  }

  // ============================================================
  // 3) ARMADO DE DATA PARA EL CARRUSEL
  // ============================================================
  // Mapea cursos destacados a CarouselItem para reutilizar el componente de carrusel del home.
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
        dateLabel: c.duration, // aquí reutilizo la duración como texto que se muestra en el card
        ctaLabel: 'Ver curso',
        ctaLink: `/cursos/${c.slug}`,
      }));
  }

  // ============================================================
  // 4) ADMIN (CRUD LOCAL)
  // ============================================================
  // Agrega un curso nuevo al arreglo (modo local).
  addCourse(course: Course): void {
    this.courses.push(course);
  }

  // Actualiza un curso existente buscando por id.
  updateCourse(updated: Course): void {
    const index = this.courses.findIndex((c) => c.id === updated.id);
    if (index !== -1) {
      this.courses[index] = { ...updated };
    }
  }

  // Elimina un curso por id del arreglo local.
  deleteCourse(id: string): void {
    this.courses = this.courses.filter((c) => c.id !== id);
  }
}
