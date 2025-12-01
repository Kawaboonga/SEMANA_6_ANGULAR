// ============================================================
// RUTAS DE FEATURES → TUTORES
// ------------------------------------------------------------
// Este archivo define todas las rutas internas bajo /tutores.
// Usa lazy loading con loadComponent (standalone components).
// Se integra con el sistema de breadcrumbs (padre/admin).
// ============================================================

import { Routes } from '@angular/router';

export const TUTORES_ROUTES: Routes = [

  // ------------------------------------------------------------
  // RUTA 1: LISTADO DE TUTORES
  // ------------------------------------------------------------
  // /tutores
  //
  // - Muestra el grid de tutores con filtros, tarjetas, etc.
  // - No usamos data.breadcrumb aquí porque el breadcrumb
  //   principal "Tutores" ya lo entrega el padre (/tutores).
  // ------------------------------------------------------------
  {
    path: '',
    loadComponent: () =>
      import('./tutores-list/tutores-list')
        .then(m => m.TutoresListComponent),
  },

  // ------------------------------------------------------------
  // RUTA 2: PERFIL DE UN TUTOR (DETALLE)
  // ------------------------------------------------------------
  // /tutores/:id
  //
  // - Muestra el perfil completo del tutor (bio, instrumentos,
  //   estilos, modalidades, disponibilidad semanal, cursos, etc.)
  //
  // - Aquí sí incluimos un breadcrumb fijo:
  //   "Perfil tutor"
  //
  // - El breadcrumb dinámico (nombre del tutor) lo agregas
  //   dentro del mismo componente si lo deseas.
  // ------------------------------------------------------------
  {
    path: ':id',
    loadComponent: () =>
      import('./tutor-profile/tutor-profile')
        .then(m => m.TutorProfileComponent),

    // Breadcrumb fijo para esta ruta
    data: { breadcrumb: 'Perfil tutor' },
  },
];
