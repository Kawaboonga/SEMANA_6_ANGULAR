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

@Directive({
  selector: '[appFadeUp]',
  standalone: true,
})
export class FadeUpDirective implements OnInit, OnDestroy {

  /** Observer que escucha cuando el elemento entra al viewport. */
  private observer?: IntersectionObserver;

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2
  ) {}

  // --------------------------------------------------------------------------
  // CICLO: INIT
  // Prepara estilos iniciales + configura el IntersectionObserver.
  // --------------------------------------------------------------------------
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
  private show(native: HTMLElement) {
    this.renderer.setStyle(native, 'opacity', '1');
    this.renderer.setStyle(native, 'transform', 'translateY(0)');
  }

  // --------------------------------------------------------------------------
  // Limpieza del observer para evitar memory leaks en scroll pesado.
  // --------------------------------------------------------------------------
  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
