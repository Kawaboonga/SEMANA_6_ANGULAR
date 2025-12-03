// ===========================================================================
// FOOTER COMPONENT (Standalone)
// ---------------------------------------------------------------------------
// Componente de pie de página global del sitio.
//
// Este componente es completamente presentacional (“dumb component”):
//   - No contiene lógica interna.
//   - Su función es únicamente renderizar el contenido del footer
//     (enlaces, redes sociales, logo, créditos, etc.).
//
// Se utiliza típicamente en app.component.html o en el layout principal.
// ===========================================================================

import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.html',
  styleUrls: ['./footer.css'],
})
export class FooterComponent {

  /**
   * @description
   * Componente Footer global del sitio.
   * Muestra información estática como:
   *  - enlaces rápidos
   *  - redes sociales
   *  - copyright
   *  - logo de la marca
   *
   * No administra datos, servicios ni estado. Es una pieza UI pura.
   *
   * @example
   * <!-- app.component.html -->
   * <app-navbar></app-navbar>
   * <router-outlet></router-outlet>
   * <app-footer></app-footer>
   *
   * @usageNotes
   * - Si en el futuro quieres cargar datos dinámicos (por ejemplo,
   *   enlaces desde un JSON o versión de la aplicación), puedes agregar
   *   propiedades públicas aquí e insertarlas en el template.
   *
   * - Puedes extenderlo para:
   *     • incluir Input() con parámetros personalizables
   *     • mostrar fecha actual o año automáticamente
   *     • agregar dark/light mode
   *
   * - Como es standalone, puedes importarlo fácilmente donde quieras:
   *   imports: [FooterComponent]
   */
  constructor() {}
}
