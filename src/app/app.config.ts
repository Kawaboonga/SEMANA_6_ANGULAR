/*
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration, withEventReplay, withHttpTransferCacheOptions } from '@angular/platform-browser';
import { provideRouter, withViewTransitions, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { authTokenInterceptor } from '@core/interceptors/auth-token-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withViewTransitions(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })
    ),
    // SSR + Hydration + cache de HTTP (incluye peticiones con Authorization)
    provideClientHydration(
      withEventReplay(),
      withHttpTransferCacheOptions({ includeRequestsWithAuthHeaders: true })
    ),
    provideHttpClient(
      withFetch(),
      withInterceptors([authTokenInterceptor])
    ),
  ],
};


import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { authTokenInterceptor } from '@core/interceptors/auth-token-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // RUTAS
    provideRouter(routes),

    // SSR + Hydration (Angular 17+)
    provideClientHydration(),

    // HTTP + Interceptores
    provideHttpClient(
      withInterceptors([authTokenInterceptor])
    ),
  ],
};*/

/*
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authTokenInterceptor } from '@core/interceptors/auth-token-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authTokenInterceptor])
    ),
  ],
};*/






import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// HTTP Client + Interceptores
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authTokenInterceptor } from '@core/interceptors/auth-token-interceptor';

/**
 * ============================================================================
 * ApplicationConfig — Configuración global de la aplicación Angular
 * ============================================================================
 *
 * - define proveedores globales (router, httpclient, interceptores, etc.)
 * - se usa en main.ts al hacer bootstrapApplication(App, appConfig)
 *
 * IMPORTANTE:
 *  - provideHttpClient habilita HttpClient en toda la app
 *  - withInterceptors agrega interceptores de manera declarativa
 *  - Si agregas más interceptores, simplemente los sumas al array
 *
 * ============================================================================
 */

export const appConfig: ApplicationConfig = {
  providers: [
    /**
     * ------------------------------------------------------------------------
     * ROUTER
     * ------------------------------------------------------------------------
     * Define todas las rutas principales de la app (public, auth, admin, etc.)
     */
    provideRouter(routes),

    /**
     * ------------------------------------------------------------------------
     * HTTP CLIENT + INTERCEPTORES
     * ------------------------------------------------------------------------
     * Habilita HttpClient y aplica interceptores globales.
     *
     * El interceptor authTokenInterceptor:
     *  - Se ejecuta en cada request HTTP
     *  - No debería modificar llamadas a /assets/**
     *    (si es necesario, puedo ajustarlo por ti)
     */
    provideHttpClient(
      withInterceptors([
        authTokenInterceptor,
        // Puedes agregar más interceptores aquí si lo necesitas
      ])
    ),
  ],
};