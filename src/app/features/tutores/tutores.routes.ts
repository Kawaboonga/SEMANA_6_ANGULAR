
import { Routes } from '@angular/router';

/**
 * Conjunto de rutas asociadas a la sección pública de **Tutores**.
 *
 * Incluye:
 * - Listado de tutores (`/tutores`)
 * - Perfil individual de tutor (`/tutores/:id`)
 *
 * @type {Routes}
 *
 * @usageNotes
 * - Los componentes se cargan usando `loadComponent()` (lazy loading).
 * - El breadcrumb "Tutores" lo aporta la ruta padre.
 * - El detalle del tutor incluye su propio breadcrumb fijo ("Perfil tutor").
 *
 * @example
 * // En app.routes.ts
 * {
 *   path: 'tutores',
 *   loadChildren: () =>
 *     import('./features/tutores/tutores.routes')
 *       .then(m => m.TUTORES_ROUTES),
 * }
 */
export const TUTORES_ROUTES: Routes = [

  // ---------------------------------------------------------------------------
  // RUTA 1: LISTADO GENERAL DE TUTORES
  // ---------------------------------------------------------------------------
  /**
   * Ruta base `/tutores`.
   *
   * @description
   * Renderiza el listado principal de tutores con:
   * - Grid responsive
   * - Filtros por instrumento, nivel, modalidad y precio
   * - OrderBy y búsqueda
   * - Animaciones FadeUp
   *
   * @usageNotes
   * No usa `data.breadcrumb` porque el breadcrumb padre ya define
   * el texto visible "Tutores".
   */
  {
    path: '',
    loadComponent: () =>
      import('./tutores-list/tutores-list')
        .then(m => m.TutoresListComponent),
  },

  // ---------------------------------------------------------------------------
  // RUTA 2: DETALLE DE TUTOR
  // ---------------------------------------------------------------------------
  /**
   * Ruta `/tutores/:id`.
   *
   * @description
   * Muestra el perfil completo de un tutor, incluyendo:
   * - Biografía
   * - Instrumentos enseñados
   * - Modalidades disponibles
   * - Estilos musicales
   * - Disponibilidad semanal
   * - Cursos dictados
   *
   * @param {string} id - Identificador único del tutor.
   *
   * @usageNotes
   * - El breadcrumb fijo "Perfil tutor" se declara aquí.
   * - Si deseas un breadcrumb dinámico (ej: nombre del tutor),
   *   agrégalo dentro de `TutorProfileComponent`.
   *
   * @example
   * /tutores/marco-vidal
   */
  {
    path: ':id',
    loadComponent: () =>
      import('./tutor-profile/tutor-profile')
        .then(m => m.TutorProfileComponent),

    data: { breadcrumb: 'Perfil tutor' },
  },
];
