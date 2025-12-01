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
export class CursoDetailComponent implements OnInit {

  // Curso principal mostrado en la página de detalle
  course: Course | null = null;

  // Otros cursos dictados por el mismo tutor (sección “Más cursos de…”)
  moreCoursesFromTutor: Course[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService
  ) {}

  // ============================================================
  // CICLO DE VIDA
  // ============================================================
  ngOnInit(): void {
    // Escucha cambios en los parámetros de la ruta (ej: /cursos/:slug).
    // Esto permite navegar entre cursos relacionados sin recrear el componente.
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');

      // Sin slug no tiene sentido el detalle → redirige a “no encontrado”.
      if (!slug) {
        this.router.navigate(['/not-found']);
        return;
      }

      // Obtiene el curso según el slug de la URL.
      const course = this.courseService.getBySlug(slug);

      // Si no se encuentra, también redirige a “no encontrado”.
      if (!course) {
        this.router.navigate(['/not-found']);
        return;
      }

      // Asigna el curso para que el template pueda renderizarlo.
      this.course = course;

      // Calcula otros cursos del mismo tutor, excluyendo el actual.
      this.moreCoursesFromTutor = this.courseService.getByTutorId(
        course.tutorId,
        course.id
      );

      // Cada vez que se carga/cambia de curso, sube al inicio de la página.
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  // ============================================================
  // NAVEGACIÓN DESDE CURSOS RELACIONADOS
  // ============================================================
  onRelatedCourseClick(slug: string, event: Event): void {
    // Evita la navegación por defecto del <a> para controlarla manualmente.
    event.preventDefault();

    this.router.navigate(['/cursos', slug]).then(() => {
      // Al terminar la navegación:
      // - ngOnInit ya está suscrito a los cambios de paramMap
      // - aquí solo se fuerza el scroll al inicio nuevamente.
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  // ============================================================
  // GETTERS PARA EL TEMPLATE
  // ============================================================

  // Devuelve el precio del curso formateado como CLP (ej: $89.990).
  get priceLabel(): string {
    if (!this.course) return '';
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    }).format(this.course.priceCLP);
  }

  // Construye un texto corto con nivel y duración del curso.
  // Ejemplo: "Intermedio · 16 h · 8 clases".
  get meta(): string {
    if (!this.course) return '';
    return `${this.course.difficulty} · ${this.course.duration}`;
  }
}
