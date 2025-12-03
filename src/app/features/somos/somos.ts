// ============================================================================
// src/app/featured/somos/somos.ts
//
// Página informativa “Somos / Sobre SoundSeeker”.
// Componente estático, minimalista y orientado a contenido.
// Incluye soporte de animación con FadeUpDirective.
// ============================================================================

import { Component } from '@angular/core';
import { FadeUpDirective } from '@shared/directives/fade-up';

/**
 * Componente de la página "Somos".
 *
 * Página estática orientada a presentar:
 * - Identidad del proyecto
 * - Filosofía SoundSeeker
 * - Objetivos, misión y visión
 * - Texto narrativo con animaciones suaves
 *
 * @component
 * @example
 * <app-somos></app-somos>
 *
 * @usageNotes
 * - No requiere lógica en TypeScript por ahora.
 * - Puede extenderse con signals o servicios si deseas
 *   cargar contenido dinámico más adelante.
 * - El estilo visual y las animaciones se controlan
 *   exclusivamente desde el HTML + CSS.
 */
@Component({
  selector: 'app-somos',

  /**
   * Módulos y directivas utilizadas por el componente.
   *
   * FadeUpDirective → permite usar `appFadeUp`
   * para animaciones de entrada basadas en scroll.
   */
  imports: [FadeUpDirective],

  /**
   * Vistas asociadas.
   * - templateUrl → estructura HTML
   * - styleUrl    → estilos específicos del componente
   */
  templateUrl: './somos.html',
  styleUrl: './somos.css',
})
export class Somos {
  /**
   * Componente sin lógica interna.
   *
   * @remarks
   * Este componente funciona como un contenedor estático de contenido
   * visual/textual. Se deja preparado para ampliaciones futuras, como:
   *  - Carga de testimonios desde un servicio
   *  - Timeline interactivo sobre la historia del proyecto
   *  - Sección dinámica usando signals
   *  - Animaciones avanzadas
   */
}
