/*import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';

const bootstrap = (context: BootstrapContext) =>
    bootstrapApplication(App, config, context);

export default bootstrap;*/



// src/main.server.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideServerRendering } from '@angular/platform-server';

import { App } from './app/app';
import { appConfig } from './app/app.config';

// El parámetro `context` se usa sin tipado explícito (Angular 20)
export default function bootstrap(context: any) {
  return bootstrapApplication(
    App,
    {
      providers: [
        ...(appConfig.providers ?? []),
        provideServerRendering(), // ✅ necesario para SSR
      ],
    },
    context // ✅ tercer argumento obligatorio en SSR
  );
}
