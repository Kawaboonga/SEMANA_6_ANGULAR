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
export class AdminCursosComponent implements OnInit {

  // ============================================================
  // 1) Servicios
  // ============================================================
  private courseService = inject(CourseService);

  // ============================================================
  // 2) State local del componente
  // ============================================================
  courses: Course[] = [];        // lista visible en la tabla
  showForm = false;              // abre/cierra form
  selectedCourse: Course | null = null; // curso a editar

  // ============================================================
  // 3) Inicialización
  // ============================================================
  ngOnInit(): void {
    // Siempre toma la lista actualizada desde el servicio
    this.courses = this.courseService.getAll();
  }

  // ============================================================
  // 4) Crear nuevo curso
  // ============================================================
  onCreate(): void {
    this.selectedCourse = null;  // modo "crear"
    this.showForm = true;
  }

  // ============================================================
  // 5) Editar curso existente
  // ============================================================
  onEdit(course: Course): void {
    // Se clona el objeto para no mutar referencia original
    this.selectedCourse = { ...course };
    this.showForm = true;
  }

  // ============================================================
  // 6) Eliminar curso
  // ============================================================
  onDelete(course: Course): void {
    if (!confirm(`¿Eliminar curso "${course.title}"?`)) return;

    this.courseService.deleteCourse(course.id);
    this.courses = this.courseService.getAll();  // refrescar tabla
  }

  // ============================================================
  // 7) Alternar flags de visibilidad: showInCarousel / isFeatured / isNew…
  // ============================================================
  onToggleFlag(course: Course, flag: keyof Course): void {
    const updated: Course = {
      ...course,
      [flag]: !course[flag], // alterna boolean
    };

    this.courseService.updateCourse(updated);

    // Actualiza la tabla sin recargar todo el servicio
    this.courses = this.courses.map(c =>
      c.id === updated.id ? updated : c
    );
  }

  // ============================================================
  // 8) Guardar datos desde el form (crear o actualizar)
  // ============================================================
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
  handleCancel(): void {
    this.showForm = false;
    this.selectedCourse = null;
  }
}
