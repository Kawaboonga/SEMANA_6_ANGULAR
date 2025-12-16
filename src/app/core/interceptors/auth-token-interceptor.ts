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

  // ---------------------------------------------------------------------------
  // 1) Ignorar assets locales (Angular)
  // ---------------------------------------------------------------------------
  if (req.url.includes('/assets/') || req.url.startsWith('assets/')) {
    return next(req);
  }

  // ---------------------------------------------------------------------------
  // 1.1) Ignorar JSON externos (GitHub Pages) para evitar CORS por Authorization
  // ---------------------------------------------------------------------------
  if (
    req.url.startsWith('https://kawaboonga.github.io/JSON_API/') ||
    req.url.endsWith('.json')
  ) {
    return next(req);
  }

  // ---------------------------------------------------------------------------
  // 2) Ignorar peticiones de autenticación
  // ---------------------------------------------------------------------------
  if (
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/register') ||
    req.url.includes('/auth/recover')
  ) {
    return next(req);
  }



  // ---------------------------------------------------------------------------
  // 3) Obtener token y agregar header si existe
  // ---------------------------------------------------------------------------
  const token = localStorage.getItem('token');

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq);
};
