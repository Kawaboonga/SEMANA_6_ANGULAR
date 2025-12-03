
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Course } from '@core/models/course.model';
import { CourseService } from '@core/services/course.service';
import { FadeUpDirective } from '@shared/directives/fade-up';

@Component({
  selector: 'app-curso-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FadeUpDirective],
  templateUrl: './curso-detail.html',
  styleUrls: ['./curso-detail.css'],
})

/**
 * Página de detalle de un curso.
 *
 * Carga un curso según su `slug` y muestra toda la información:
 * descripción, imagen, niveles, precio, tutor y cursos relacionados.
 *
 * Flujo general:
 * - Escucha cambios en los parámetros de la ruta: `/cursos/:slug`.
 * - Busca el curso correspondiente (si no existe → redirige a not-found).
 * - Muestra el curso seleccionado.
 * - Calcula otros cursos del mismo tutor para mostrarlos como sugerencias.
 * - Cada vez que se cambia de curso, hace scroll al inicio para mejorar UX.
 *
 * Este componente se vuelve a actualizar dinámicamente cuando se hace
 * click en un curso relacionado, sin destruirse, porque está suscrito
 * a los cambios del `paramMap`.
 *
 * @usageNotes
 * - Esta vista debe estar declarada en rutas como: `/cursos/:slug`.
 * - Se apoya exclusivamente en `CourseService` (mock local).
 * - Si algún día se usa API real, este componente ya está preparado
 *   para escuchar cambios del slug sin recrear la vista.
 */
export class CursoDetailComponent implements OnInit {
  /** Curso principal mostrado en la vista. */
  course: Course | null = null;

  /** Lista de cursos del mismo tutor, excluyendo el actual. */
  moreCoursesFromTutor: Course[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
  ) {}

  // ============================================================
  // CICLO DE VIDA
  // ============================================================

  /**
   * Se suscribe a los parámetros de la ruta (`slug`) y actualiza la vista
   * cada vez que cambia. Esto permite navegar entre cursos relacionados sin
   * recrear el componente.
   *
   * @example
   * // URL → /cursos/guitarra-rock
   * // URL → /cursos/guitarra-blues
   *
   * @returns void
   */
  ngOnInit(): void {
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

      // Asignar curso para la vista
      this.course = course;

      // Calcular cursos relacionados del mismo tutor
      this.moreCoursesFromTutor = this.courseService.getByTutorId(
        course.tutorId,
        course.id,
      );

      // UX: cuando se cambia de curso, subir la página
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  // ============================================================
  // NAVEGACIÓN ENTRE CURSOS RELACIONADOS
  // ============================================================

  /**
   * Maneja la navegación manual cuando el usuario hace clic en un curso
   * relacionado. Se evita la navegación por defecto del `<a>` y se fuerza
   * el scroll al inicio.
   *
   * @param slug Slug del curso al que se desea navegar.
   * @param event Evento del clic para prevenir comportamiento por defecto.
   *
   * @example
   * onRelatedCourseClick('curso-guitarra-blues', $event)
   *
   * @usageNotes
   * - ngOnInit ya está escuchando los cambios del slug.
   * - La navegación solo dispara la actualización del estado interno.
   */
  onRelatedCourseClick(slug: string, event: Event): void {
    event.preventDefault();

    this.router.navigate(['/cursos', slug]).then(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  // ============================================================
  // GETTERS PARA EL TEMPLATE
  // ============================================================

  /**
   * Formatea el precio del curso como CLP.
   * Ejemplo: `$89.990`
   *
   * @returns string Precio formateado o string vacío si no hay curso cargado.
   */
  get priceLabel(): string {
    if (!this.course) return '';
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    }).format(this.course.priceCLP);
  }

  /**
   * Construye una cadena corta con nivel, duración y clases.
   * Ejemplo: `"Intermedio · 16 h · 8 clases"`
   *
   * @returns string Meta descriptiva del curso.
   */
  get meta(): string {
    if (!this.course) return '';
    return `${this.course.difficulty} · ${this.course.duration}`;
  }
}
