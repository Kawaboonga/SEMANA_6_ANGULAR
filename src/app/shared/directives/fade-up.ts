// ============================================================================
// FADE UP DIRECTIVE
// ----------------------------------------------------------------------------
// Aplica un efecto de aparición suave al hacer scroll.
// - Estado inicial: opacidad 0 + leve desplazamiento hacia abajo.
// - Se activa cuando el elemento entra en el viewport (IntersectionObserver).
// - Si el observer se retrasa (caso Chrome lento / SSR), se fuerza un fallback
//   para evitar que el contenido quede invisible al cargar la página.
// ============================================================================

import {
  Directive,
  ElementRef,
  Renderer2,
  OnInit,
  OnDestroy,
} from '@angular/core';

/**
 * @description
 * Directiva estructural que aplica un efecto de “fade-up” a cualquier elemento
 * sobre el que se use el atributo `appFadeUp`.
 *
 * Funcionamiento:
 *  - Inicialmente deja el elemento con `opacity: 0` y `translateY(12px)`.
 *  - Cuando el elemento entra en el viewport, anima a `opacity: 1` y `translateY(0)`.
 *  - Usa `IntersectionObserver` para detectar la entrada en pantalla.
 *  - Incluye un fallback con `setTimeout` para evitar que el contenido
 *    quede invisible si el observer falla o se retrasa.
 *
 * @usageNotes
 * ```html
 * <!-- Cualquier componente / elemento -->
 * <section class="container" appFadeUp>
 *   <h2>Sección animada</h2>
 *   <p>Este contenido se desvanece hacia arriba al entrar en pantalla.</p>
 * </section>
 * ```
 */

@Directive({
  selector: '[appFadeUp]',
  standalone: true,
})
export class FadeUpDirective implements OnInit, OnDestroy {

  /**
   * @description
   * Observer que detecta cuando el elemento asociado entra en el viewport.
   * Se inicializa en `ngOnInit` y se limpia en `ngOnDestroy`.
   */
  private observer?: IntersectionObserver;

  /**
   * @description
   * Constructor de la directiva.
   *
   * @param el Referencia al elemento DOM nativo donde se aplica `appFadeUp`.
   * @param renderer Abstracción segura de Angular para manipular estilos/DOM.
   *
   * @example
   * ```ts
   * constructor(
   *   private el: ElementRef<HTMLElement>,
   *   private renderer: Renderer2
   * ) {}
   * ```
   */
  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2
  ) {}

  // --------------------------------------------------------------------------
  // CICLO: INIT
  // Prepara estilos iniciales + configura el IntersectionObserver.
  // --------------------------------------------------------------------------

  /**
   * @description
   * Hook de inicialización de la directiva.
   *
   * Responsabilidades:
   *  - Configurar el estado inicial del elemento (oculto + desplazado).
   *  - Crear el `IntersectionObserver` que aplica el fade cuando el
   *    elemento entra en el viewport.
   *  - Configurar un fallback con `setTimeout` por si el observer
   *    no llega a dispararse (casos edge/SSR/hidratación lenta).
   *
   * @example
   * ```ts
   * ngOnInit(): void {
   *   // Estilos iniciales + observer + fallback
   * }
   * ```
   */
  ngOnInit(): void {
    const native = this.el.nativeElement;

    // Estado inicial (contenido oculto y apenas desplazado)
    this.renderer.setStyle(native, 'opacity', '0');
    this.renderer.setStyle(native, 'transform', 'translateY(12px)');
    this.renderer.setStyle(
      native,
      'transition',
      'opacity 0.7s ease-out, transform 0.7s ease-out'
    );
    this.renderer.setStyle(native, 'will-change', 'opacity, transform');

    // Observer sensible: se activa apenas el elemento toca el viewport.
    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          // Efecto visible → sin volver a observar este elemento
          this.show(native);
          this.observer?.unobserve(native);
          this.observer?.disconnect();
        });
      },
      {
        threshold: 0,        // 0 = en cuanto aparece un pixel en pantalla
        rootMargin: '0px',   // sin adelantos ni retrasos
      }
    );

    this.observer.observe(native);

    // ----------------------------------------------------------------------
    // FALLBACK DE SEGURIDAD
    // Si el observer tarda (casos edge), activamos igualmente el fade.
    // Evita que el usuario vea la página sin elementos visibles.
    // ----------------------------------------------------------------------
    setTimeout(() => {
      const currentOpacity = getComputedStyle(native).opacity;
      if (currentOpacity === '0') {
        this.show(native);
      }
    }, 200);
  }

  // --------------------------------------------------------------------------
  // Muestra el contenido con la animación final del fade.
  // --------------------------------------------------------------------------

  /**
   * @description
   * Aplica los estilos finales de la animación:
   *  - `opacity: 1`
   *  - `translateY(0)`
   *
   * Se invoca tanto desde el `IntersectionObserver` como desde el fallback.
   *
   * @param native Elemento sobre el que se aplican los estilos.
   *
   * @example
   * ```ts
   * this.show(this.el.nativeElement);
   * ```
   */
  private show(native: HTMLElement) {
    this.renderer.setStyle(native, 'opacity', '1');
    this.renderer.setStyle(native, 'transform', 'translateY(0)');
  }

  // --------------------------------------------------------------------------
  // Limpieza del observer para evitar memory leaks en scroll pesado.
  // --------------------------------------------------------------------------

  /**
   * @description
   * Hook de limpieza de la directiva.
   *
   * Se asegura de desconectar el `IntersectionObserver` para evitar
   * fugas de memoria (especialmente en páginas con mucho scroll o
   * en navegación frecuente entre vistas).
   *
   * @example
   * ```ts
   * ngOnDestroy(): void {
   *   this.observer?.disconnect();
   * }
   * ```
   */
  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
