
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

/**
 * ============================================================================
 * Bootstrap principal de la aplicación Angular (standalone)
 * ============================================================================
 *
 * - Usa bootstrapApplication() en lugar de módulos tradicionales.
 * - Carga el componente raíz <app-root>.
 * - Aplica la configuración global definida en app.config.ts.
 * - Añade una clase al body al terminar la carga (útil para animaciones).
 * ============================================================================
 */

bootstrapApplication(App, appConfig)
  .then(() => {
    // Se ejecuta una vez que la aplicación está lista
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      document.body.classList.add('is-loaded');
    }
  })
  .catch((err) => console.error('Error al iniciar Angular:', err));