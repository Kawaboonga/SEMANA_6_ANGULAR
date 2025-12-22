import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CourseService } from '@core/services/course.service';
import { AuthService } from '@core/services/auth.service';
import {
  Course,
  CourseDifficulty,
  CourseModality,
} from '@core/models/course.model';
import { CourseCardComponent } from '@shared/components/course-card/course-card';
import { CourseFormComponent } from '@shared/forms/course-form/course-form';
import { FadeUpDirective } from '@shared/directives/fade-up';

@Component({
  selector: 'app-cursos-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CourseCardComponent,
    CourseFormComponent,
    FadeUpDirective,
  ],
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
 * Además, tal como en Productos, el Admin puede:
 * - Crear un nuevo curso
 * - Editar un curso existente
 * - Eliminar un curso
 *
 * Todo esto reutilizando `CourseFormComponent` y persistiendo con `CourseService`.
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
export class CursosListComponent {
  // ============================================================
  // INYECCIÓN DE SERVICIOS
  // ============================================================

  /** Servicio que entrega y persiste cursos (JSON remoto + localStorage + CRUD). */
  private courseService = inject(CourseService);

  /** Servicio de autenticación para saber si el usuario actual es admin. */
  private authService = inject(AuthService);

  // ============================================================
  // ADMIN: ¿ES ADMINISTRADOR?
  // ============================================================

  /** True si el usuario logueado tiene rol admin. */
  isAdmin = computed(() => this.authService.isAdmin());

  // ============================================================
  // ADMIN: FORM STATE (CREAR / EDITAR)
  // ============================================================

  /** Controla si se muestra el formulario inline (crear/editar). */
  showForm = signal(false);

  /** Curso seleccionado para editar (null en modo crear). */
  selectedCourse = signal<Course | null>(null);

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
  // CONSTRUCTOR: efecto reactivo con signals (importante)
  // ============================================================

  constructor() {
    /**
     * En GitHub Pages / HttpClient, el JSON se carga de forma ASÍNCRONA.
     * Por eso, en vez de leer una sola vez con getAll(), reaccionamos
     * al signal `courses()` para refrescar la vista cuando llegue la data.
     *
     * @important
     * - `effect()` debe crearse dentro de un injection context.
     * - El lugar más seguro es el constructor (igual patrón que Productos).
     */
    effect(() => {
      this.allCourses = this.courseService.courses();
      this.applyFilters();
    });
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
   *
   * @important
   * - En algunos JSON, `modalities` podría venir undefined.
   *   Por eso se usa `(course.modalities ?? [])` para evitar errores y
   *   asegurar que el filtro no “rompa” la página.
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
        (course.modalities ?? []).includes(this.selectedModality);

      return matchDifficulty && matchModality;
    });
  }

  // ============================================================
  // ADMIN: CRUD DESDE LA VISTA PÚBLICA (CARDS)
  // ============================================================

  /** Abre el formulario en modo "crear". */
  onAdminCreate(): void {
    if (!this.isAdmin()) return;

    this.selectedCourse.set(null);
    this.showForm.set(true);
  }

  /** Abre el formulario en modo "editar" buscando el curso por id. */
  onAdminEdit(courseId: string): void {
    if (!this.isAdmin()) return;

    const found = this.courseService.getAll().find((c) => c.id === courseId) ?? null;
    // Clonamos para evitar mutar referencias compartidas.
    this.selectedCourse.set(found ? { ...found } : null);
    this.showForm.set(true);
  }

  /** Elimina el curso (la confirmación ocurre en la card, igual que productos). */
  onAdminDelete(courseId: string): void {
    if (!this.isAdmin()) return;
    this.courseService.deleteCourse(courseId);
  }

  /** Guarda (create o update) el curso emitido desde CourseFormComponent. */
  onAdminSave(course: Course): void {
    if (!this.isAdmin()) return;

    const exists = this.courseService.getAll().some((c) => c.id === course.id);

    if (exists) this.courseService.updateCourse(course);
    else this.courseService.addCourse(course);

    this.showForm.set(false);
    this.selectedCourse.set(null);
  }

  /** Cancela el formulario (crear/editar) y limpia el estado. */
  onAdminCancel(): void {
    this.showForm.set(false);
    this.selectedCourse.set(null);
  }
}
