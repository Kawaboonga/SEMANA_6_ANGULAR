// src/app/core/guards/admin.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  // Obtengo el servicio de autenticación para revisar el rol del usuario.
  // Uso inject() porque este guard está hecho con la API nueva de Angular.
  const auth = inject(AuthService);

  // Inyecto el router para poder redirigir si el usuario no tiene permisos.
  const router = inject(Router);

  // Reviso si el usuario actual tiene el rol de admin.
  // Si es admin → permito el acceso a la ruta protegida.
  if (auth.isAdmin()) {
    return true;
  }

  // Si llega aquí significa que NO es admin.
  // Lo mando a /mi-cuenta o a donde quiera que vea su perfil o un mensaje.
  // Esto evita que usuarios normales entren a zonas del panel de administración.
  router.navigate(['/mi-cuenta']);

  // Bloqueo el acceso a la ruta.
  return false;
};
