
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

/**
 * Listado público de cursos.
 *
 * Este componente muestra todos los cursos disponibles en la plataforma
 * y permite filtrarlos por:
 * - nivel de dificultad (Principiante, Intermedio, Avanzado)
 * - modalidad (Presencial, Online, Híbrido)
 *
 * También utiliza el componente `<app-course-card>` para renderizar
 * cada curso en forma de tarjeta, y la directiva appFadeUp para animar
 * la aparición de los elementos al hacer scroll.
 *
 * @usageNotes
 * - El filtrado es completamente local (sin API).
 * - El usuario puede combinar ambos filtros libremente.
 * - Si el filtro queda sin coincidencias, el template puede mostrar
 *   un mensaje del tipo “No encontramos cursos con esos criterios”.
 *
 * @example
 * <app-cursos-list></app-cursos-list>
 */
export class CursosListComponent implements OnInit {

  // ============================================================
  // INYECCIÓN DE SERVICIO
  // ============================================================

  /**
   * Servicio que entrega los cursos desde el mock local.
   * Se usa para cargar todos los cursos al iniciar el componente.
   */
  private courseService = inject(CourseService);

  // ============================================================
  // LISTAS PRINCIPALES
  // ============================================================

  /** Lista completa de cursos disponibles (sin filtros). */
  allCourses: Course[] = [];

  /** Lista filtrada que se muestra en la interfaz. */
  filtered: Course[] = [];

  /** Opciones de nivel de dificultad disponibles para filtrar. */
  difficulties: CourseDifficulty[] = ['Principiante', 'Intermedio', 'Avanzado'];

  /** Opciones de modalidad disponibles para filtrar. */
  modalities: CourseModality[] = ['Presencial', 'Online', 'Híbrido'];

  /**
   * Nivel seleccionado por el usuario.
   * 'todos' significa que no se aplica filtro por dificultad.
   */
  selectedDifficulty: 'todos' | CourseDifficulty = 'todos';

  /**
   * Modalidad seleccionada por el usuario.
   * 'todas' significa que no se aplica filtro por modalidad.
   */
  selectedModality: 'todas' | CourseModality = 'todas';

  // ============================================================
  // CICLO DE VIDA
  // ============================================================

  /**
   * Carga los cursos desde el servicio y aplica los filtros iniciales.
   *
   * @returns void
   */
  ngOnInit(): void {
    this.allCourses = this.courseService.getAll();
    this.applyFilters();
  }

  // ============================================================
  // MANEJO DE FILTROS
  // ============================================================

  /**
   * Evento cuando el usuario cambia la dificultad en el selector.
   *
   * @param value Nuevo valor seleccionado (‘todos’ o un nivel válido).
   */
  onDifficultyChange(value: 'todos' | CourseDifficulty): void {
    this.selectedDifficulty = value;
    this.applyFilters();
  }

  /**
   * Evento cuando el usuario cambia la modalidad en el selector.
   *
   * @param value Nueva modalidad seleccionada (‘todas’ o una modalidad válida).
   */
  onModalityChange(value: 'todas' | CourseModality): void {
    this.selectedModality = value;
    this.applyFilters();
  }

  // ============================================================
  // FILTRADO GENERAL
  // ============================================================

  /**
   * Aplica ambos filtros (dificultad + modalidad) de manera simultánea.
   *
   * Lógica de filtrado:
   * - Si la dificultad seleccionada es "todos", no filtra ese criterio.
   * - Si la modalidad seleccionada es "todas", tampoco filtra ese criterio.
   *
   * @returns void
   *
   * @example
   * // Para refrescar la vista después de un selector:
   * this.applyFilters();
   *
   * @usageNotes
   * - Este método es privado porque solo lo usa el componente internamente.
   * - Puedes extender la lógica para agregar filtros adicionales (precio, rating…),
   *   manteniendo este mismo patrón.
   */
  private applyFilters(): void {
    this.filtered = this.allCourses.filter((course) => {
      // Filtro por dificultad
      const matchDifficulty =
        this.selectedDifficulty === 'todos' ||
        course.difficulty === this.selectedDifficulty;

      // Filtro por modalidad
      const matchModality =
        this.selectedModality === 'todas' ||
        course.modalities.includes(this.selectedModality);

      return matchDifficulty && matchModality;
    });
  }
}
