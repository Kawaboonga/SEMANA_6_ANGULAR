// ============================================================================
// IMPORTANTE:
// - El breadcrumb del listado NO se declara aquí porque se
//   genera dinámicamente desde el componente ServicioDetail.
// - Este archivo no requiere NgModule (todo standalone).
// ============================================================================

import { Routes } from '@angular/router';

/**
 * ============================================================
 * RUTAS DEL MÓDULO "SERVICIOS"
 * ------------------------------------------------------------
 * Estructura:
 *   /servicios             → listado de servicios disponibles
 *   /servicios/:slug       → detalle individual del servicio
 *
 * @remarks
 * - Cada ruta usa `loadComponent()` para lazy loading real.
 * - Los componentes son standalone → no se usan módulos.
 * - El breadcrumb del detalle se calcula dinámicamente según
 *   el nombre del servicio, usando signals en ServicioDetail.
 * ============================================================
 */
export const SERVICIOS_ROUTES: Routes = [

  /**
   * ============================================================
   * RUTA PRINCIPAL: /servicios
   * ------------------------------------------------------------
   * Carga la vista del listado general:
   *   <app-servicios-list />
   *
   * No requiere parámetros. Muestra las categorías o cards de
   * cada servicio según tu implementación del componente.
   * ============================================================
   */
  {
    path: '',
    loadComponent: () =>
      import('./servicios-list/servicios-list')
        .then(m => m.ServiciosList),
    // El breadcrumb general se calcula fuera o no se usa
  },

  /**
   * ============================================================
   * RUTA DE DETALLE: /servicios/:slug
   * ------------------------------------------------------------
   * :slug → identificador del servicio (ej: "ajuste-guitarra")
   *
   * El detalle renderiza:
   *   <app-servicio-detail />
   *
   * @usageNotes
   * - No se define data.breadcrumb porque el nombre visible del
   *   breadcrumb depende dinámicamente del servicio cargado.
   * - ServicioDetail usa ActivatedRoute + ServiceService para
   *   obtener el servicio por slug y exponer su nombre.
   * ============================================================
   */
  {
    path: ':slug',
    loadComponent: () =>
      import('./servicio-detail/servicio-detail')
        .then(m => m.ServicioDetail),

    // El breadcrumb se genera dinámicamente desde ServicioDetail
    // data: { breadcrumb: 'Detalle del servicio' },
  },

];
