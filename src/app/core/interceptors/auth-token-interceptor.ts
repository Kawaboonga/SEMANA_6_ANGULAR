import { HttpInterceptorFn } from '@angular/common/http';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  // Reviso si en localStorage hay un token guardado.
  // Este token normalmente lo guardo después de hacer login.
  const token = localStorage.getItem('token');

  // Si no hay token, dejo pasar la petición tal como viene.
  // Esto evita romper llamadas públicas o sin autenticación.
  if (!token) {
    return next(req);
  }

  // Si existe token, creo una copia de la petición original.
  // clone() es necesario porque las peticiones HTTP en Angular son inmutables.
  const authReq = req.clone({
    setHeaders: {
      // Agrego la cabecera Authorization para que el backend reconozca al usuario.
      // Formato estándar: "Bearer <token>".
      Authorization: `Bearer ${token}`,
    },
  });

  // Finalmente envío la petición modificada al siguiente interceptor o al backend.
  return next(authReq);
};
