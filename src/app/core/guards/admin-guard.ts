
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

/**
 * Guard de protección para rutas administrativas.
 *
 * Su propósito es simple: **permitir la entrada solo a usuarios con rol admin**.
 * Si no cumple esa condición, se redirige automáticamente a `/mi-cuenta`.
 *
 * Uso típico:
 * - Se asigna en las rutas del panel de administración.
 * - Evita que usuarios normales entren a zonas restringidas.
 *
 * @usageNotes
 * - Este guard asume que `AuthService.isAdmin()` devuelve `true` o `false`.
 * - Si en el futuro manejas estados de carga o tokens externos, este guard puede extenderse.
 * - La redirección actual es `/mi-cuenta`, pero puedes cambiarla por una página 403 personalizada.
 *
 * @example
 * // app.routes.ts
 * {
 *   path: 'admin',
 *   canActivate: [adminGuard],
 *   loadComponent: () => import('./admin/dashboard'),
 * }
 */
export const adminGuard: CanActivateFn = (route, state) => {
  /**
   * Obtiene el servicio de autenticación para revisar el rol del usuario.
   * Uso `inject()` porque este guard está hecho con la API nueva de Angular.
   */
  const auth = inject(AuthService);

  /**
   * Router inyectado para permitir redirecciones cuando
   * el usuario no tiene los permisos necesarios.
   */
  const router = inject(Router);

  /**
   * Si el usuario es admin, permitimos avanzar a la ruta protegida.
   */
  if (auth.isAdmin()) {
    return true;
  }

  /**
   * Si llega aquí NO es admin.
   * Se redirige a `/mi-cuenta` para bloquear el acceso a zonas restringidas.
   * Esto evita que usuarios normales vean o manipulen contenido del panel admin.
   */
  router.navigate(['/mi-cuenta']);

  /**
   * Retorna `false` indicando que la navegación no está permitida.
   */
  return false;
};
