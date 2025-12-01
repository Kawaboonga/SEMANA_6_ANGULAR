// src/app/featured/servicios/servicios.routes.ts

import { Routes } from '@angular/router';

/**
 * ============================================================
 * RUTAS DEL MÓDULO "SERVICIOS"
 * ------------------------------------------------------------
 * - Estructura basada en lazy loading con loadComponent()
 * - Adaptado a Angular 20 (standalone architecture)
 * 
 * Rutas:
 *   /servicios                → listado de servicios
 *   /servicios/:slug          → detalle individual
 *
 * NOTA SOBRE BREADCRUMB:
 *   El breadcrumb del detalle lo generamos dinámicamente
 *   desde el propio componente ServicioDetail, por eso NO se
 *   usa data:{breadcrumb:...} aquí.
 * ============================================================
 */
export const SERVICIOS_ROUTES: Routes = [

  /**
   * ============================================================
   * RUTA PRINCIPAL: /servicios
   * ------------------------------------------------------------
   * Carga el listado de servicios usando loadComponent().
   * No usa NgModule porque toda la app es standalone.
   * ============================================================
   */
  {
    path: '',
    loadComponent: () =>
      import('./servicios-list/servicios-list')
        .then(m => m.ServiciosList),
  },

  /**
   * ============================================================
   * RUTA DETALLE: /servicios/:slug
   * ------------------------------------------------------------
   * :slug → identificador SEO del servicio
   * Ejemplo: /servicios/ajuste-guitarra
   *
   * IMPORTANTE:
   *   No definimos data.breadcrumb porque el breadcrumb será
   *   generado en tiempo real por ServicioDetail usando signals.
   * ============================================================
   */
  {
    path: ':slug',
    loadComponent: () =>
      import('./servicio-detail/servicio-detail')
        .then(m => m.ServicioDetail),

    // breadcrumb dinámico → lo maneja ServicioDetail
    // data: { breadcrumb: 'Detalle del servicio' },
  },

];
