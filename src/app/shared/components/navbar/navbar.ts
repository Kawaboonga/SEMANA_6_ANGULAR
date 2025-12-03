// ============================================================================
// NAVBAR COMPONENT
// ----------------------------------------------------------------------------
// Barra de navegación principal del sitio.
//
// - Muestra estado de sesión: login / logout.
// - Indica el rol del usuario mediante badges dinámicos.
// - Cambia visualmente al hacer scroll (modo opaco).
// - Compatible con SSR gracias a isPlatformBrowser.
// - Maneja menú hamburguesa cerrándolo al navegar (Bootstrap Collapse).
//
// Este componente es totalmente standalone (Angular 20).
// ============================================================================

import {
  Component,
  HostListener,
  inject,
  PLATFORM_ID,
  OnInit,
} from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import {
  NgIf,
  NgClass,
  isPlatformBrowser,
} from '@angular/common';

import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf, NgClass],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class NavbarComponent implements OnInit {

  // ==========================================================================
  // 1) INYECCIÓN DE SERVICIOS
  // ==========================================================================

  /**
   * @description Servicio de autenticación global.
   */
  private auth = inject(AuthService);

  /**
   * @description Router para navegación programática (login/logout).
   */
  private router = inject(Router);

  /**
   * @description PlatformId para detecciones SSR-safe.
   */
  private platformId = inject(PLATFORM_ID);

  /**
   * @description Flag que indica si estamos en navegador (no SSR).
   */
  private isBrowser = isPlatformBrowser(this.platformId);


  // ==========================================================================
  // 2) SESIÓN DE USUARIO (Signals + getters)
  // ==========================================================================

  /**
   * @description Usuario actualmente logueado o null.
   * @return User | null
   */
  get currentUser() {
    return this.auth.currentUser();
  }

  /**
   * @description Indica si hay un usuario logueado.
   * @return boolean
   */
  get isLogged(): boolean {
    return this.auth.isLoggedIn();
  }

  /**
   * @description Indica si el usuario tiene rol ADMIN.
   * @return boolean
   */
  get isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  /**
   * @description Etiqueta legible según el rol del usuario.
   * @return 'Admin' | 'Instructor' | 'Usuario' | null
   */
  get roleLabel(): string | null {
    const user = this.currentUser;
    if (!user) return null;

    switch (user.role) {
      case 'admin': return 'Admin';
      case 'instructor': return 'Instructor';
      default: return 'Usuario';
    }
  }

  /**
   * @description Clase CSS asociada al badge del rol.
   * @return string
   */
  get roleBadgeClass(): string {
    const role = this.roleLabel;

    if (role === 'Admin') return 'bg-warning text-dark';
    if (role === 'Instructor') return 'bg-info text-dark';
    return 'bg-secondary';
  }

  /**
   * @description Cierra sesión y redirige al home.
   * @usageNotes También cierra menú mobile (si estaba abierto).
   */
  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
    this.closeMobileNav();
  }


  // ==========================================================================
  // 3) DETECCIÓN DE SCROLL → Navbar opaca
  // ==========================================================================

  /**
   * @description
   * Detecta el scroll global y aplica la clase `nav-scroll-opaque` cuando
   * el usuario baja más de 40px.
   *
   * @example
   * // HTML:
   * <nav class="navbar" [ngClass]="{ 'nav-scroll-opaque': ... }"></nav>
   */
  @HostListener('window:scroll')
  onWindowScroll() {
    if (!this.isBrowser) return;

    const nav = document.querySelector('.navbar');
    if (!nav) return;

    const y = window.scrollY || document.documentElement.scrollTop;
    (nav as HTMLElement).classList.toggle('nav-scroll-opaque', y > 40);
  }

  /**
   * @description Ejecuta la lógica de scroll inmediatamente al cargar,
   * útil cuando el usuario refresca la página ya scrolleado.
   */
  ngOnInit() {
    if (!this.isBrowser) return;
    this.onWindowScroll();
  }


  // ==========================================================================
  // 4) CONTROL DEL MENÚ HAMBURGUESA (Bootstrap Collapse)
  // ==========================================================================

  /**
   * @description
   * Cierra el menú mobile si está abierto.  
   * Usa import dinámico de Bootstrap para evitar ejecución en SSR.
   *
   * @usageNotes
   * Llamar en:
   *   (click)="onNavItemClick()"
   *   logout()
   */
  private closeMobileNav(): void {
    if (!this.isBrowser) return;

    const nav = document.getElementById('mainNav');
    if (!nav || !nav.classList.contains('show')) return;

    import('bootstrap/js/dist/collapse')
      .then(({ default: Collapse }) => {
        const instance =
          (Collapse as any).getInstance(nav)
          ?? new (Collapse as any)(nav, { toggle: false });

        instance.hide();
      })
      .catch(err => {
        console.error('Error cargando Collapse de Bootstrap:', err);
      });
  }

  /**
   * @description Handler para links dentro del menú mobile.
   * @example
   * <a routerLink="/cursos" (click)="onNavItemClick()">Cursos</a>
   */
  onNavItemClick(): void {
    this.closeMobileNav();
  }
}
