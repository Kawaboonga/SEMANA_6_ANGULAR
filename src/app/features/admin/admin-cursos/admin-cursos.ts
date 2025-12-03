// src/app/features/admin/admin-cursos/admin-cursos.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Course } from '@core/models/course.model';
import { CourseService } from '@core/services/course.service';
import { CourseFormComponent } from '@shared/forms/course-form/course-form';

@Component({
  selector: 'app-admin-cursos',
  standalone: true,
  imports: [CommonModule, CourseFormComponent],
  templateUrl: './admin-cursos.html',
  styleUrls: ['./admin-cursos.css'],
})
/**
 * Panel de administración de cursos.
 *
 * Este componente:
 * - lista todos los cursos en una tabla,
 * - permite crear y editar cursos mediante un formulario compartido,
 * - permite eliminar cursos,
 * - alterna flags visuales (`showInCarousel`, `isFeatured`, `isNew`, etc.),
 * - se apoya en `CourseService` como fuente de verdad.
 *
 * @usageNotes
 * - Usa `CourseFormComponent` como formulario hijo para alta/edición.
 * - La tabla se refresca siempre contra `CourseService.getAll()`.
 * - El componente no conoce detalles del almacenamiento (mock / API),
 *   solo trabaja contra el servicio.
 */
export class AdminCursosComponent implements OnInit {

  // ============================================================
  // 1) Servicios
  // ============================================================

  /** Servicio central de cursos (lectura + CRUD local). */
  private courseService = inject(CourseService);

  // ============================================================
  // 2) State local del componente
  // ============================================================

  /** Lista visible en la tabla del panel de cursos. */
  courses: Course[] = [];

  /** Controla si se muestra u oculta el formulario de curso. */
  showForm = false;

  /** Curso que se está editando actualmente (null en modo "crear"). */
  selectedCourse: Course | null = null;

  // ============================================================
  // 3) Inicialización
  // ============================================================

  /**
   * Carga inicial de cursos desde el servicio.
   * Se ejecuta una sola vez cuando el componente se monta.
   *
   * @example
   * ngOnInit(): void {
   *   this.courses = this.courseService.getAll();
   * }
   */
  ngOnInit(): void {
    // Siempre toma la lista actualizada desde el servicio
    this.courses = this.courseService.getAll();
  }

  // ============================================================
  // 4) Crear nuevo curso
  // ============================================================

  /**
   * Entra en modo "crear curso".
   *
   * - Limpia `selectedCourse`.
   * - Abre el formulario.
   *
   * @example
   * (click)="onCreate()"
   */
  onCreate(): void {
    this.selectedCourse = null;  // modo "crear"
    this.showForm = true;
  }

  // ============================================================
  // 5) Editar curso existente
  // ============================================================

  /**
   * Entra en modo edición para el curso seleccionado.
   *
   * - Clona el curso para no mutar la referencia original.
   * - Abre el formulario con datos precargados.
   *
   * @param course curso a editar
   */
  onEdit(course: Course): void {
    this.selectedCourse = { ...course };
    this.showForm = true;
  }

  // ============================================================
  // 6) Eliminar curso
  // ============================================================

  /**
   * Elimina un curso del sistema después de confirmar.
   *
   * - Muestra un `confirm` simple.
   * - Llama a `courseService.deleteCourse`.
   * - Refresca la tabla con `getAll()`.
   *
   * @param course curso a eliminar
   */
  onDelete(course: Course): void {
    if (!confirm(`¿Eliminar curso "${course.title}"?`)) return;

    this.courseService.deleteCourse(course.id);
    this.courses = this.courseService.getAll();  // refrescar tabla
  }

  // ============================================================
  // 7) Alternar flags de visibilidad
  // ============================================================

  /**
   * Alterna un flag booleano del curso:
   * `showInCarousel`, `isFeatured`, `isNew`, `isOffer`, etc.
   *
   * - Crea una copia del curso con el flag invertido.
   * - Actualiza el curso en el servicio.
   * - Actualiza la tabla local sin recargar todo.
   *
   * @param course curso a actualizar
   * @param flag propiedad booleana del modelo Course a alternar
   *
   * @example
   * (click)="onToggleFlag(course, 'showInCarousel')"
   */
  onToggleFlag(course: Course, flag: keyof Course): void {
    const updated: Course = {
      ...course,
      [flag]: !course[flag], // alterna boolean
    };

    this.courseService.updateCourse(updated);

    this.courses = this.courses.map(c =>
      c.id === updated.id ? updated : c
    );
  }

  // ============================================================
  // 8) Guardar datos desde el form (crear o actualizar)
  // ============================================================

  /**
   * Maneja el evento de guardado que emite `CourseFormComponent`.
   *
   * - Detecta si el curso ya existe (edición) o no (creación).
   * - En modo creación, genera un `id` si falta.
   * - Llama al método correspondiente del servicio.
   * - Refresca la tabla.
   * - Cierra el formulario.
   *
   * @param course curso devuelto por el formulario
   */
  handleSave(course: Course): void {
    const exists = this.courses.some(c => c.id === course.id);

    if (exists) {
      // modo edición
      this.courseService.updateCourse(course);
    } else {
      // modo creación
      if (!course.id) {
        course.id = crypto.randomUUID();
      }
      this.courseService.addCourse(course);
    }

    // Actualizar tabla y cerrar form
    this.courses = this.courseService.getAll();
    this.selectedCourse = null;
    this.showForm = false;
  }

  // ============================================================
  // 9) Cancelar edición/creación
  // ============================================================

  /**
   * Cancela el flujo de creación/edición del curso.
   *
   * - Oculta el formulario.
   * - Limpia `selectedCourse`.
   *
   * @example
   * (cancel)="handleCancel()"
   */
  handleCancel(): void {
    this.showForm = false;
    this.selectedCourse = null;
  }
}
