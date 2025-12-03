
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

/**
 * Guard encargado de proteger rutas que requieren que el usuario esté logueado.
 *
 * Su propósito es asegurar que solo usuarios autenticados puedan entrar a
 * secciones privadas como `/mi-cuenta`, áreas de configuración o el panel admin.
 *
 * Si el usuario no está autenticado:
 * - es redirigido a `/auth/login`
 * - se guarda la URL original en `returnUrl` para volver automáticamente luego del login
 *
 * @usageNotes
 * - Este guard se recomienda para todas las rutas que dependan del usuario activo.
 * - `AuthService.isLoggedIn()` debe manejar correctamente el estado LOGIN / LOGOUT.
 * - El manejo de `returnUrl` es útil para experiencias más naturales de navegación.
 *
 * @example
 * // Uso típico en app.routes.ts:
 * {
 *   path: 'mi-cuenta',
 *   canActivate: [authGuard],
 *   loadComponent: () => import('./pages/account/account.component'),
 * }
 */
export const authGuard: CanActivateFn = (route, state) => {
  /**
   * Obtengo el servicio de autenticación para verificar
   * si el usuario ya inició sesión.
   *
   * Se usa `inject()` porque los guards modernos en Angular
   * son funciones en lugar de clases.
   */
  const auth = inject(AuthService);

  /**
   * Inyecto el Router para poder redirigir al login
   * en caso de que el usuario no esté autenticado.
   */
  const router = inject(Router);

  /**
   * Si el usuario está logueado → permitir acceso inmediato.
   * Esto protege cualquier ruta privada donde se requiera sesión activa.
   */
  if (auth.isLoggedIn()) {
    return true;
  }

  /**
   * Usuario NO autenticado.
   * Se envía a `/auth/login` y se pasa la URL original como queryParam.
   *
   * Ejemplo:
   * Intentó entrar a `/admin`
   * → se redirige a `/auth/login?returnUrl=/admin`
   *
   * Después del login, la app puede enviarlo automáticamente de regreso.
   */
  router.navigate(['/auth/login'], {
    queryParams: { returnUrl: state.url },
  });

  /**
   * Se bloquea el acceso a la ruta protegida.
   */
  return false;
};
