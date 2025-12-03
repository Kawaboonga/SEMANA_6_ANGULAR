
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

// Componentes compartidos que componen la estructura principal del sitio.
import { NavbarComponent } from '@shared/components/navbar/navbar';
import { FooterComponent } from '@shared/components/footer/footer';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb';

/**
 * Layout principal de la aplicación.
 *
 * Su función es actuar como la **estructura base del sitio**: un contenedor
 * que mantiene fijo el navbar, los breadcrumbs y el footer, mientras
 * en el centro se renderiza el contenido dinámico mediante `RouterOutlet`.
 *
 * Este layout se usa para todas las páginas públicas del proyecto,
 * entregando coherencia visual y evitando repetir la misma estructura
 * en cada componente individual.
 *
 * @usageNotes
 * - No contiene lógica propia; su rol es puramente estructural.
 * - El contenido real de cada página se carga en el `<router-outlet>`.
 * - Si en el futuro agregas un sidebar global, anuncios o banners,
 *   este es el lugar ideal para integrarlos.
 *
 * @example
 * // En app.routes.ts:
 * {
 *   path: '',
 *   component: MainLayout,
 *   children: [
 *     { path: '', loadComponent: () => import('../home/home') },
 *     { path: 'productos', loadComponent: () => import('../productos/product-list') },
 *   ]
 * }
 */
@Component({
  selector: 'app-main-layout',
  standalone: true,
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css'],

  // Importo todo lo que necesita este layout para funcionar.
  // Este layout es básicamente la “capa principal” donde se renderizan
  // las diferentes páginas del proyecto.
  imports: [
    RouterOutlet,           // Aquí Angular coloca el contenido de cada ruta.
    NavbarComponent,        // Barra superior que aparece en todo el sitio.
    FooterComponent,        // Pie de página global.
    BreadcrumbComponent,    // Miga de pan de navegación.
    CommonModule,           // Directivas básicas como *ngIf, *ngFor, etc.
  ],
})
export class MainLayout {
  /**
   * Este layout no necesita lógica interna.
   * Su único propósito es estructurar la vista general del sitio:
   * header, breadcrumbs (si aplica), contenido dinámico y footer.
   *
   * Todo el comportamiento dinámico depende de las rutas hijas
   * y de sus propios componentes.
   */
  constructor() {}
}
