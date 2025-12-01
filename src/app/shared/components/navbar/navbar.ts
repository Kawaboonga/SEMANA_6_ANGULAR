// ============================================================================
// NAVBAR COMPONENT
// ----------------------------------------------------------------------------
// Barra de navegación principal del sitio.
// - Muestra el estado de sesión (login / logout).
// - Cambia visualmente al hacer scroll (navbar opaca).
// - Detecta el rol del usuario y despliega badges dinámicos.
// - Usa signals de AuthService (currentUser, isLoggedIn, isAdmin).
// ============================================================================

import {Component, HostListener, inject, PLATFORM_ID, OnInit,} from '@angular/core';
import {Router, RouterLink, RouterLinkActive,} from '@angular/router';
import { NgIf,NgClass, isPlatformBrowser,} from '@angular/common';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf, NgClass],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class NavbarComponent implements OnInit {

  // ================================================================
  // 1) Servicios e infraestructura
  // ================================================================
  private auth = inject(AuthService);
  private router = inject(Router);

  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId); // SSR-safe


  // ================================================================
  // 2) SESIÓN DE USUARIO (Signals + getters legibles)
  // ================================================================

  /** Retorna el usuario actual o null (signal → User | null). */
  get currentUser() {
    return this.auth.currentUser();
  }

  /** Estado booleano de sesión activa (computed). */
  get isLogged(): boolean {
    return this.auth.isLoggedIn();
  }

  /** ¿Tiene rol admin? */
  get isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  /** Nombre legible del rol del usuario actual. */
  get roleLabel(): string | null {
    const user = this.currentUser;
    if (!user) return null;

    switch (user.role) {
      case 'admin':
        return 'Admin';
      case 'instructor':
        return 'Instructor';
      default:
        return 'Usuario';
    }
  }

  /** Clases CSS para el “badge” del rol. */
  get roleBadgeClass(): string {
    const role = this.roleLabel;

    if (role === 'Admin') return 'bg-warning text-dark';
    if (role === 'Instructor') return 'bg-info text-dark';
    return 'bg-secondary';
  }

  /** Cerrar sesión y redirigir al home. */
  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
    this.closeMobileNav(); // por si cierra sesión desde el menú mobile
  }


  // ================================================================
  // 3) NAVBAR SCROLL → Cambia fondo / estilo al desplazar página
  // ================================================================

  /**
   * HostListener: escucha scroll global de la ventana.
   * Agrega o quita .nav-scroll-opaque a la navbar.
   */
  @HostListener('window:scroll')
  onWindowScroll() {
    if (!this.isBrowser) return;

    const nav = document.querySelector('.navbar');
    if (!nav) return;

    const y = window.scrollY || document.documentElement.scrollTop;

    // Clase activada cuando bajamos más de 40px
    (nav as HTMLElement).classList.toggle('nav-scroll-opaque', y > 40);
  }

  /** Ejecutamos la detección de scroll al iniciar (en caso de refresco). */
  ngOnInit() {
    if (!this.isBrowser) return;
    this.onWindowScroll();
  }


  // ================================================================
  // 4) NAVBAR TOGGLE → Cerrar el menú hamburguesa al hacer clic (SSR-safe)
  // ================================================================

  /**
   * Cierra el menú colapsable en móvil si está abierto.
   * Usa import() dinámico de Bootstrap solo en el navegador.
   */
  private closeMobileNav(): void {
    if (!this.isBrowser) return;

    const nav = document.getElementById('mainNav');
    if (!nav || !nav.classList.contains('show')) return;

    // Import dinámico: evita que Bootstrap se ejecute en el servidor
    import('bootstrap/js/dist/collapse')
      .then(({ default: Collapse }) => {
        const instance =
          (Collapse as any).getInstance(nav) ?? new (Collapse as any)(nav, { toggle: false });

        instance.hide();
      })
      .catch((err) => {
        // Opcional: log para debug, no rompe nada
        console.error('Error cargando Collapse de Bootstrap:', err);
      });
  }

  /**
   * Handler genérico para elementos del menú.
   * Llamar desde los links / botones con (click)="onNavItemClick()".
   */
  onNavItemClick(): void {
    this.closeMobileNav();
  }
}