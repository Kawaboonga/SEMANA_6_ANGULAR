import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Course } from '@core/models/course.model';
import { CourseService } from '@core/services/course.service';
import { AuthService } from '@core/services/auth.service';

import { CourseFormComponent } from '@shared/forms/course-form/course-form';
import { FadeUpDirective } from '@shared/directives/fade-up';

@Component({
  selector: 'app-curso-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, CourseFormComponent, FadeUpDirective],
  templateUrl: './curso-detail.html',
  styleUrls: ['./curso-detail.css'],
})

/**
 * Página de detalle de un curso.
 *
 * Carga un curso según su `slug` y muestra toda la información:
 * descripción, imagen, niveles, precio, tutor y cursos relacionados.
 *
 * Mejora (Admin):
 * - Si el usuario es administrador, puede:
 *   - Editar el curso desde el detalle (reutiliza CourseFormComponent)
 *   - Eliminar el curso desde el detalle
 *
 * @usageNotes
 * - Esta vista debe estar declarada en rutas como: `/cursos/:slug`.
 * - Se apoya en `CourseService` (JSON remoto + localStorage + fallback).
 * - Está suscrito a cambios del `paramMap` para navegar entre cursos relacionados
 *   sin destruir el componente.
 */
export class CursoDetailComponent {
  // ============================================================
  // INYECCIONES
  // ============================================================

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private authService = inject(AuthService);

  // ============================================================
  // STATE PRINCIPAL
  // ============================================================

  /** Curso principal mostrado en la vista. */
  course: Course | null = null;

  /** Lista de cursos del mismo tutor, excluyendo el actual. */
  moreCoursesFromTutor: Course[] = [];

  // ============================================================
  // ADMIN: ¿ES ADMINISTRADOR?
  // ============================================================

  /** True si el usuario logueado tiene rol admin. */
  isAdmin = computed(() => this.authService.isAdmin());

  // ============================================================
  // ADMIN: FORM STATE (EDITAR)
  // ============================================================

  /** Controla si se muestra el formulario inline (editar). */
  showForm = signal(false);

  /** Curso seleccionado para editar (clonado). */
  selectedCourse = signal<Course | null>(null);

  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor() {
    // ============================================================
    // CICLO DE VIDA (equivalente a ngOnInit)
    // ============================================================
    /**
     * Se suscribe a los parámetros de la ruta (`slug`) y actualiza la vista
     * cada vez que cambia. Esto permite navegar entre cursos relacionados sin
     * recrear el componente.
     */
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');

      // Sin slug → no tiene sentido continuar
      if (!slug) {
        this.router.navigate(['/not-found']);
        return;
      }

      // Buscar el curso según el slug
      const course = this.courseService.getBySlug(slug);
      if (!course) {
        this.router.navigate(['/not-found']);
        return;
      }

      // Si veníamos editando y se cambia el slug, cerramos el formulario
      this.showForm.set(false);
      this.selectedCourse.set(null);

      // Asignar curso para la vista
      this.course = course;

      // Calcular cursos relacionados del mismo tutor
      this.moreCoursesFromTutor = this.courseService.getByTutorId(
        course.tutorId,
        course.id,
      );

      // UX: cuando se cambia de curso, subir la página
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================================
  // NAVEGACIÓN ENTRE CURSOS RELACIONADOS
  // ============================================================

  /**
   * Maneja la navegación manual cuando el usuario hace clic en un curso
   * relacionado. Se evita la navegación por defecto del `<a>` y se fuerza
   * el scroll al inicio.
   */
  onRelatedCourseClick(slug: string, event: Event): void {
    event.preventDefault();

    this.router.navigate(['/cursos', slug]).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================================
  // ADMIN: ACCIONES DESDE EL DETALLE
  // ============================================================

  /** Abre el formulario en modo editar (si es admin). */
  onAdminEdit(): void {
    if (!this.isAdmin() || !this.course) return;
    this.selectedCourse.set({ ...this.course });
    this.showForm.set(true);
  }

  /** Elimina el curso actual (si es admin) y vuelve al listado. */
  onAdminDelete(): void {
    if (!this.isAdmin() || !this.course) return;

    const ok = confirm(
      `¿Eliminar el curso "${this.course.title}"?\nEsta acción no se puede deshacer.`,
    );
    if (!ok) return;

    this.courseService.deleteCourse(this.course.id);
    this.router.navigate(['/cursos']);
  }

  /** Guarda cambios desde el CourseFormComponent (update). */
  onAdminSave(course: Course): void {
    if (!this.isAdmin()) return;

    this.courseService.updateCourse(course);
    this.course = course;

    this.showForm.set(false);
    this.selectedCourse.set(null);
  }

  /** Cancela edición. */
  onAdminCancel(): void {
    this.showForm.set(false);
    this.selectedCourse.set(null);
  }

  // ============================================================
  // GETTERS PARA EL TEMPLATE
  // ============================================================

  /** Formatea el precio del curso como CLP. Ejemplo: `$89.990` */
  get priceLabel(): string {
    if (!this.course) return '';
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    }).format(this.course.priceCLP);
  }

  /** Construye una cadena corta con nivel, duración y clases. */
  get meta(): string {
    if (!this.course) return '';
    return `${this.course.difficulty} · ${this.course.duration}`;
  }
}
