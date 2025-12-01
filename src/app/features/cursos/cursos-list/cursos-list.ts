// src/app/featured/cursos/cursos-list/cursos-list.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CourseService } from '@core/services/course.service';
import { Course, CourseDifficulty, CourseModality } from '@core/models/course.model';
import { CourseCardComponent } from '@shared/components/course-card/course-card';
import { FadeUpDirective } from '@shared/directives/fade-up';


@Component({
  selector: 'app-cursos-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CourseCardComponent, FadeUpDirective],
  templateUrl: './cursos-list.html',
})
export class CursosListComponent implements OnInit {

  // ============================================================
  // INYECCIÓN DE SERVICIO
  // ============================================================
  private courseService = inject(CourseService);

  // ============================================================
  // LISTAS PRINCIPALES
  // ============================================================
  allCourses: Course[] = [];   // todos los cursos disponibles
  filtered: Course[] = [];     // cursos filtrados según los selectores

  // Opciones de filtros
  difficulties: CourseDifficulty[] = ['Principiante', 'Intermedio', 'Avanzado'];
  modalities: CourseModality[] = ['Presencial', 'Online', 'Híbrido'];

  // Valores actuales de los filtros
  selectedDifficulty: 'todos' | CourseDifficulty = 'todos';
  selectedModality: 'todas' | CourseModality = 'todas';

  // ============================================================
  // CICLO DE VIDA
  // ============================================================
  ngOnInit(): void {
    // Cargar cursos desde el servicio
    this.allCourses = this.courseService.getAll();

    // Aplicar los filtros iniciales
    this.applyFilters();
  }

  // ============================================================
  // MANEJO DE FILTROS (select de dificultad y modalidad)
  // ============================================================
  onDifficultyChange(value: 'todos' | CourseDifficulty): void {
    this.selectedDifficulty = value;
    this.applyFilters();
  }

  onModalityChange(value: 'todas' | CourseModality): void {
    this.selectedModality = value;
    this.applyFilters();
  }

  // ============================================================
  // FILTRADO GENERAL
  // ============================================================
  /**
   * Aplica simultáneamente los filtros de dificultad y modalidad.
   * Solo se muestran los cursos que cumplen ambas condiciones.
   */
  private applyFilters(): void {
    this.filtered = this.allCourses.filter(course => {
      
      // Filtro de dificultad
      const matchDifficulty =
        this.selectedDifficulty === 'todos' ||
        course.difficulty === this.selectedDifficulty;

      // Filtro de modalidad
      const matchModality =
        this.selectedModality === 'todas' ||
        course.modalities.includes(this.selectedModality);

      return matchDifficulty && matchModality;
    });
  }
}
