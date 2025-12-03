

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TutorService } from '@core/services/tutor.service';
import { Tutor } from '@core/models/tutor.model';

import { Course } from '@core/models/course.model';
import { CourseService } from '@core/services/course.service';
import { CourseCardComponent } from '@shared/components/course-card/course-card';
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
  imports: [CommonModule, CourseCardComponent, RouterLink, FadeUpDirective],
  templateUrl: './tutor-profile.html',
  styleUrl: './tutor-profile.css',
})
export class TutorProfileComponent {

  // ==========================================================================
  //  INYECCIÓN DE SERVICIOS Y RUTA
  // ==========================================================================
  /**
   * Lee parámetros de la URL (ej: :id).
   * @private
   */
  private route = inject(ActivatedRoute);

  /**
   * Servicio para obtener datos de tutores y sus filtros.
   * @private
   */
  private tutorService = inject(TutorService);

  /**
   * Servicio con todos los cursos disponibles.
   * @private
   */
  private courseService = inject(CourseService);

  // ==========================================================================
  //  PROPIEDADES DE ESTADO
  // ==========================================================================

  /**
   * Tutor actualmente seleccionado según la URL.
   *
   * @type {Tutor | undefined}
   */
  tutor: Tutor | undefined;

  /**
   * Cursos dictados por este tutor.  
   * Se carga automáticamente al resolver el tutor.
   *
   * @type {Course[]}
   */
  coursesFromTutor: Course[] = [];

  /**
   * Pestaña actualmente activa en la UI del perfil.
   *
   * @type {'perfil' | 'cursos' | 'resenas' | 'equipo'}
   * @default 'perfil'
   */
  activeTab: 'perfil' | 'cursos' | 'resenas' | 'equipo' = 'perfil';

  // ==========================================================================
  //  CICLO DE VIDA
  // ==========================================================================

  /**
   * Inicializa el componente, resolviendo:
   * - El tutor asociado al :id
   * - Los cursos impartidos por dicho tutor
   *
   * @returns {void}
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

    console.log(
      'TutorProfile: cursos asociados →',
      this.tutor.id,
      this.coursesFromTutor
    );
  }

  // ==========================================================================
  //  CAMBIAR PESTAÑA
  // ==========================================================================

  /**
   * Cambia la pestaña visible en el UI del perfil.
   *
   * @param {'perfil' | 'cursos' | 'resenas' | 'equipo'} tab
   *        Nombre de la pestaña objetivo.
   *
   * @example
   * setTab('cursos');
   *
   * @returns {void}
   */
  setTab(tab: 'perfil' | 'cursos' | 'resenas' | 'equipo'): void {
    this.activeTab = tab;
  }
}
