// src/app/featured/somos/somos.ts

import { Component } from '@angular/core';
import { FadeUpDirective } from '@shared/directives/fade-up';

/**
 * ============================================================
 * COMPONENTE: Somos
 * ------------------------------------------------------------
 * - Standalone component (Angular 20)
 * - Carga su propio HTML y CSS
 * - No tiene lógica interna por ahora, es una página estática
 *   informativa (quiénes somos / filosofía SoundSeeker).
 * - Incluye FadeUpDirective para animaciones de entrada.
 * ============================================================
 */
@Component({
  selector: 'app-somos',

  /**
   * ------------------------------------------------------------
   * IMPORTS
   * ------------------------------------------------------------
   * FadeUpDirective → permite usar el atributo `appFadeUp`
   * para animaciones basadas en IntersectionObserver.
   */
  imports: [FadeUpDirective],

  /**
   * ------------------------------------------------------------
   * TEMPLATE Y ESTILOS
   * ------------------------------------------------------------
   * - templateUrl → HTML propio de la página
   * - styleUrl    → CSS modular específico
   */
  templateUrl: './somos.html',
  styleUrl: './somos.css',
})
export class Somos {
  /**
   * ============================================================
   * NOTA:
   * Este componente no requiere lógica en TS de momento.
   * Si más adelante necesitas:
   *  - Cargar información desde un servicio
   *  - Mostrar un timeline animado
   *  - Usar signals para contenido dinámico
   * 
   * Solo me avisas y te lo implemento.
   * ============================================================
   */
}
