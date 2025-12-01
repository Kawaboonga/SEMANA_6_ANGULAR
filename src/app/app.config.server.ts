/*import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes))
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);*/

import { ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/ssr';

// Config mínima para SSR (sin prerender). 
// Si luego quieres usar serverRoutes + prerender, los agregamos aquí.
export const config: ApplicationConfig = {
  providers: [
    provideServerRendering(),
  ],
};
