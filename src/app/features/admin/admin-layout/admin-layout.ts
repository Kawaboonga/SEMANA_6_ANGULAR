// src/app/features/admin/layout/admin-layout.component.ts

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
export class AdminLayout {
  // ============================================================
  // 1) Servicios principales (auth + router)
  // ============================================================

  // Servicio de autenticación para saber quién está logueado
  // y permitir el cierre de sesión desde el admin.
  private auth = inject(AuthService);

  // Router para manejar navegación manual (volver al home, etc.)
  private router = inject(Router);

  // ============================================================
  // 2) Datos del usuario actual
  // ============================================================

  // currentUser viene del AuthService como signal,
  // lo envolvemos en computed para consumirlo directo en el template.
  currentUser = computed(() => this.auth.currentUser());

  // ============================================================
  // 3) Acciones del layout
  // ============================================================

  // Cierra la sesión y limpia el currentUser del AuthService.
  // El guard redirigirá al login cuando corresponda.
  onLogout(): void {
    this.auth.logout();
  }

  // Navega al home público de la aplicación.
  goToHome(): void {
    this.router.navigate(['/']);
  }
}
