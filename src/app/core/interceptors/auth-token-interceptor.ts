import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Interceptor encargado de agregar el token JWT a cada petición HTTP saliente.
 *
 * Su función es sencilla:
 * - Deja pasar sin cambios las peticiones a `/assets` y rutas de autenticación.
 * - Para el resto, agrega el header `Authorization: Bearer <token>` si existe un token guardado.
 *
 * Este interceptor permite que el backend reconozca al usuario autenticado
 * sin que los componentes o servicios tengan que preocuparse del header.
 *
 * @usageNotes
 * - El token se obtiene directamente desde `localStorage`.
 * - Si en el futuro usas Refresh Tokens o un AuthService centralizado,
 *   este interceptor puede modificarse para manejar expiración o renovación.
 * - Importante: No debe agregarse token a rutas como login o register
 *   para evitar errores de autorización.
 *
 * @example
 * // ejemplo en app.config.ts
 * providers: [
 *   provideHttpClient(withInterceptors([authTokenInterceptor])),
 * ]
 */
export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  /**
   * No enviamos token en llamados a assets locales.
   * Angular requiere esto para no intentar agregar Authorization
   * a imágenes, JSON o archivos estáticos.
   */
  if (req.url.startsWith('/assets')) {
    return next(req);
  }

  /**
   * No enviamos token en peticiones relacionadas con autenticación.
   * Ejemplos típicos: login, register, recover-password, etc.
   */
  if (
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/register') ||
    req.url.includes('/auth/recover')
  ) {
    return next(req);
  }

  /**
   * Recuperamos el token almacenado por AuthService.persistSession().
   * Si no existe, la petición continúa sin header adicional.
   */
  const token = localStorage.getItem('token');

  if (!token) {
    return next(req);
  }

  /**
   * Clonamos la request y agregamos el header Authorization.
   */
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq);
};
