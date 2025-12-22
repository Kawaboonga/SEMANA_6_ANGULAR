

import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { TutorService } from '@core/services/tutor.service';
import { Tutor } from '@core/models/tutor.model';

import { Course } from '@core/models/course.model';
import { CourseService } from '@core/services/course.service';
import { CourseCardComponent } from '@shared/components/course-card/course-card';
import { TutorFormComponent } from '@shared/forms/tutor-form/tutor-form';
import { AuthService } from '@core/services/auth.service';
import { FadeUpDirective } from '@shared/directives/fade-up';

/**
 * ============================================================================
 * Componente: TutorProfileComponent
 * ============================================================================
 *
 * @description
 * Muestra la información detallada de un tutor individual, basado en el parámetro
 * dinámico `:id` proveniente de la ruta.  
 * Incluye panel de tabs, cursos asociados y sección de perfil ampliado.
 *
 * @usageNotes
 * - El componente busca los datos del tutor vía TutorService.
 * - Si el tutor no existe o el id es inválido, no realiza redirecciones:  
 *   puedes agregarlas fácilmente según tus reglas UX.
 * - La pestaña activa se controla mediante la propiedad `activeTab`.
 *
 * @example
 * <app-tutor-profile-page></app-tutor-profile-page>
 */

@Component({
  selector: 'app-tutor-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    CourseCardComponent,
    TutorFormComponent,
    RouterLink,
    FadeUpDirective,
  ],
  templateUrl: './tutor-profile.html',
  styleUrl: './tutor-profile.css',
})
export class TutorProfileComponent {
  // ==========================================================================
  //  INYECCIÓN DE SERVICIOS Y RUTA
  // ==========================================================================

  /** Lee parámetros de la URL (ej: :id). */
  private route = inject(ActivatedRoute);

  /** Para navegar de vuelta a /tutores luego de eliminar. */
  private router = inject(Router);

  /** Servicio para obtener datos de tutores y sus filtros. */
  private tutorService = inject(TutorService);

  /** Servicio con todos los cursos disponibles. */
  private courseService = inject(CourseService);

  /** Servicio de autenticación (para habilitar acciones admin). */
  private authService = inject(AuthService);

  // ==========================================================================
  //  PROPIEDADES DE ESTADO
  // ==========================================================================

  /** Tutor actualmente seleccionado según la URL. */
  tutor: Tutor | undefined;

  /** Cursos dictados por este tutor. */
  coursesFromTutor: Course[] = [];

  /** Pestaña actualmente activa en la UI del perfil. */
  activeTab: 'perfil' | 'cursos' | 'resenas' | 'equipo' = 'perfil';

  // ==========================================================================
  // ADMIN: ¿ES ADMINISTRADOR?
  // ==========================================================================

  /** True si el usuario logueado tiene rol admin. */
  isAdmin = computed(() => this.authService.isAdmin());

  // ==========================================================================
  // ADMIN: FORM STATE (EDITAR)
  // ==========================================================================

  /** Controla si se muestra el formulario inline (editar). */
  showForm = signal(false);

  /** Tutor seleccionado para editar (clonado). */
  selectedTutor = signal<Tutor | null>(null);

  // ==========================================================================
  //  CICLO DE VIDA
  // ==========================================================================

  /**
   * Inicializa el componente, resolviendo:
   * - El tutor asociado al :id
   * - Los cursos impartidos por dicho tutor
   */
  ngOnInit(): void {
    /** ID del tutor desde la ruta */
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      console.warn('TutorProfile: parámetro ":id" no encontrado');
      return;
    }

    // ------------------------------------------------------------
    // 1) BUSCAR TUTOR
    // ------------------------------------------------------------
    const found = this.tutorService.getTutorById(id);

    if (!found) {
      console.warn('TutorProfile: no se encontró tutor con id', id);
      return;
    }

    this.tutor = found;
    console.log('TutorProfile: tutor encontrado', this.tutor);

    // ------------------------------------------------------------
    // 2) CARGAR CURSOS ASOCIADOS
    // ------------------------------------------------------------
    this.coursesFromTutor = this.courseService.getCoursesByTutor(this.tutor.id);

    console.log('TutorProfile: cursos asociados →', this.tutor.id, this.coursesFromTutor);
  }

  // ==========================================================================
  //  CAMBIAR PESTAÑA
  // ==========================================================================

  /** Cambia la pestaña visible en el UI del perfil. */
  setTab(tab: 'perfil' | 'cursos' | 'resenas' | 'equipo'): void {
    this.activeTab = tab;
  }

  // ==========================================================================
  // ADMIN: ACCIONES DESDE EL DETALLE
  // ==========================================================================

  /** Abre el formulario en modo editar (si es admin). */
  onAdminEdit(): void {
    if (!this.isAdmin() || !this.tutor) return;
    this.selectedTutor.set({ ...this.tutor });
    this.showForm.set(true);
  }

  /** Elimina el tutor actual (si es admin) y vuelve al listado. */
  onAdminDelete(): void {
    if (!this.isAdmin() || !this.tutor) return;

    const ok = confirm(
      `¿Eliminar el tutor "${this.tutor.name}"?\nEsta acción no se puede deshacer.`,
    );
    if (!ok) return;

    this.tutorService.deleteTutor(this.tutor.id);
    this.router.navigate(['/tutores']);
  }

  /** Guarda cambios desde el TutorFormComponent (update). */
  onAdminSave(tutor: Tutor): void {
    if (!this.isAdmin()) return;

    // upsert = crea si no existe / actualiza si existe
    this.tutorService.upsertTutor(tutor);
    this.tutor = tutor;

    this.showForm.set(false);
    this.selectedTutor.set(null);
  }

  /** Cancela edición. */
  onAdminCancel(): void {
    this.showForm.set(false);
    this.selectedTutor.set(null);
  }
}
