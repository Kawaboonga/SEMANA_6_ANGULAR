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
};