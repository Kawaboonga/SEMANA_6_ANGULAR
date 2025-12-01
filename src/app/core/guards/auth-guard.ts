// src/app/core/guards/auth-guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  // Traigo el servicio de auth para verificar si el usuario está logueado.
  // Esta forma de inject() se usa porque los guards ahora son funciones y no clases.
  const auth = inject(AuthService);

  // También obtengo el router para poder redirigir al login si no está autenticado.
  const router = inject(Router);

  // Si el usuario ya inició sesión → lo dejo pasar sin más.
  // Esto protege rutas privadas como /mi-cuenta, /admin, etc.
  if (auth.isLoggedIn()) {
    return true;
  }

  // Si llega acá es porque NO está logueado.
  // Lo mando al login, pero además guardo la URL que intentaba abrir.
  // returnUrl sirve para volver automáticamente después del login.
  router.navigate(['/auth/login'], {
    queryParams: { returnUrl: state.url }, // Ej: si venía de /admin → después del login vuelve ahí
  });

  // Se bloquea el acceso porque no está autenticado.
  return false;
};
