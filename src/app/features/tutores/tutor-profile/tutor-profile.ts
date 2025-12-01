// ======================================================================
// TUTOR PROFILE COMPONENT
// ----------------------------------------------------------------------
// Este componente muestra el perfil completo de un tutor:
//
//  • Información principal: nombre, avatar, instrumentos, estilos, ciudad.
//  • Modalidades con íconos.
//  • Descripción larga (fullDescription).
//  • Tabs: Perfil, Cursos, Reseñas (futuro), Equipo (futuro).
//  • Listado de cursos dictados por el tutor.
//
// Se usa en la ruta:
//    /tutores/:id
//
// Totalmente standalone, sin NgModules.
// ======================================================================

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TutorService } from '@core/services/tutor.service';
import { Tutor } from '@core/models/tutor.model';

import { Course } from '@core/models/course.model';
import { CourseService } from '@core/services/course.service';
import { CourseCardComponent } from '@shared/components/course-card/course-card';
import { FadeUpDirective } from '@shared/directives/fade-up';

@Component({
  selector: 'app-tutor-profile-page',
  standalone: true,
  imports: [CommonModule, CourseCardComponent, RouterLink, FadeUpDirective],
  templateUrl: './tutor-profile.html',
  styleUrl: './tutor-profile.css',
})
export class TutorProfileComponent {

  // ============================================================
  // INYECCIÓN DE SERVICIOS Y RUTA
  // ============================================================
  private route = inject(ActivatedRoute);
  private tutorService = inject(TutorService);
  private courseService = inject(CourseService);

  // ============================================================
  // PROPIEDADES
  // ============================================================

  /** Tutor actualmente activo (según :id del URL) */
  tutor: Tutor | undefined;

  /** Cursos dictados por el tutor */
  coursesFromTutor: Course[] = [];

  /**
   * Control de pestañas del UI:
   * - perfil  → info general del tutor
   * - cursos  → cursos que imparte
   * - resenas → reseñas (espacio para futuro)
   * - equipo  → gear del tutor (futuro)
   */
  activeTab: 'perfil' | 'cursos' | 'resenas' | 'equipo' = 'perfil';

  // ============================================================
  // CICLO DE VIDA (ngOnInit)
  // ============================================================
  ngOnInit(): void {

    // 1) Leer el parámetro dinámico ":id"
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      console.warn('TutorProfile: no se encontró el parámetro "id" en la ruta');
      return;
    }

    // 2) Buscar el tutor en el servicio
    const found = this.tutorService.getTutorById(id);

    if (!found) {
      console.warn('TutorProfile: no se encontró el tutor con id', id);
      return;
    }

    // Tutor listo
    this.tutor = found;
    console.log('TutorProfile: tutor encontrado', this.tutor);

    // ============================================================
    // 3) CARGAR CURSOS ASOCIADOS A ESTE TUTOR
    // ============================================================
    // Relación:
    //     course.tutorId === tutor.id
    //
    // Servicio: courseService.getCoursesByTutor(tutorId)
    //
    this.coursesFromTutor = this.courseService.getCoursesByTutor(this.tutor.id);

    console.log(
      'TutorProfile: cursos asociados al tutor →',
      this.tutor.id,
      this.coursesFromTutor
    );
  }

  // ============================================================
  // CAMBIAR PESTAÑA ACTIVA
  // ============================================================
  setTab(tab: 'perfil' | 'cursos' | 'resenas' | 'equipo'): void {
    this.activeTab = tab;
  }
}
