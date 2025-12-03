
import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Router,
  RouterLink,
  RouterOutlet,
  RouterLinkActive
} from '@angular/router';

import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    RouterLinkActive
  ],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css'],
})


/**
 * Layout principal del panel de administración.
 *
 * Este layout define la estructura base del módulo /admin:
 * - Barra lateral con navegación interna
 * - Encabezado con información del usuario logueado
 * - Contenedor principal para las rutas hijas mediante `<router-outlet>`
 *
 * También maneja acciones globales como cerrar sesión y volver al home.
 *
 * @usageNotes
 * - El guard `adminGuard` protege este layout para evitar acceso de usuarios sin rol admin.
 * - `currentUser` viene desde AuthService como signal y se usa directo en el template.
 * - La navegación interna (`routerLinkActive`) permite resaltar secciones activas del panel.
 */

export class AdminLayout {

  // ============================================================
  // 1) Servicios principales (auth + router)
  // ============================================================

  /**
   * Servicio de autenticación usado para:
   * - obtener los datos del usuario actual
   * - permitir cerrar sesión desde el panel admin
   */

  private auth = inject(AuthService);

  /**
   * Router usado para navegación manual:
   * - volver al home público
   * - acciones que no dependan solo del template
   */

  private router = inject(Router);

  // ============================================================
  // 2) Datos del usuario actual
  // ============================================================

  /**
   * Usuario actualmente logueado.
   * Se envuelve en `computed()` para consumirlo directamente en el HTML
   * sin tener que suscribirse manualmente.
   *
   * Útil para mostrar foto, nombre o menú de perfil dentro del admin.
   */
  currentUser = computed(() => this.auth.currentUser());

  // ============================================================
  // 3) Acciones del layout
  // ============================================================

  /**
   * Cierra sesión limpiando el estado interno y almacenamiento persistente.
   * Después de esto, el guard de /admin bloqueará la vista y enviará al login.
   *
   * @example
   * <button (click)="onLogout()">Cerrar sesión</button>
   */

  onLogout(): void {
    this.auth.logout();
  }

  /**
   * Navega al home público de la aplicación.
   * Se utiliza en botones tipo “Volver al sitio” o branding del panel.
   *
   * @example
   * <span class="logo" (click)="goToHome()">SoundSeeker</span>
   */
  
  goToHome(): void {
    this.router.navigate(['/']);
  }
}
