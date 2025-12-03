
import { Component, AfterViewInit, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Carousel } from '@shared/components/carousel/carousel';
import { CarouselItem } from '@shared/components/carousel/carousel.types';
import { CarouselDataService } from '@shared/services/carousel-data';

import { TutorService } from '@core/services/tutor.service';
import { Tutor } from '@core/models/tutor.model';

import { FadeUpDirective } from '@shared/directives/fade-up';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Carousel, RouterLink, FadeUpDirective],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
/**
 * Página principal del sitio.
 *
 * Aquí se combinan:
 * - El hero con efecto de parallax.
 * - Carruseles con tutores, productos, cursos, noticias y ofertas.
 * - Secciones con animaciones de entrada (fade-up, scroll).
 *
 * La lógica está dividida entre:
 * - `ngOnInit`: carga de datos + configuración inicial del layout.
 * - `ngAfterViewInit`: activación de animaciones y fallback del parallax.
 * - `ngOnDestroy`: limpieza de listeners y estados del DOM.
 *
 * Nota:
 * Este componente es “pesado” por diseño: concentra animaciones y loaders
 * específicos del home porque son únicos del sitio.
 *
 * Si más adelante integras SSR, ya está preparado con isBrowser.
 */
export class Home implements OnInit, AfterViewInit, OnDestroy {
  // ============================================================
  // 1) INYECCIÓN DE SERVICIOS
  // ============================================================

  /** Servicio que reúne los items para los diferentes carruseles del home. */
  private dataService = inject(CarouselDataService);

  /** Servicio de tutores reales (mock local + signals) para mostrar en carrusel. */
  private tutorService = inject(TutorService);

  // ============================================================
  // 2) DATA PARA CARRUSELES
  // ============================================================

  /** Lista de tutores reales que aparece en el carrusel “Tutores Destacados”. */
  tutorItems: Tutor[] = [];

  /** Carrusel de productos destacados. */
  productItems: CarouselItem[] = [];

  /** Carrusel de cursos recomendados. */
  courseItems: CarouselItem[] = [];

  /** Carrusel de contenidos destacados (puede ser hero secundario). */
  highlightItems: CarouselItem[] = [];

  /** Carrusel de ofertas activas. */
  offerItems: CarouselItem[] = [];

  /** Carrusel de noticias recientes. */
  newsItems: CarouselItem[] = [];

  // ============================================================
  // 3) CONTROL DE ENTORNO
  // ============================================================

  /**
   * Flag que indica si estamos en un entorno de navegador.
   * Necesario porque este componente usa APIs del DOM (window, document),
   * y eso rompe SSR si no se verifica previamente.
   */
  private isBrowser =
    typeof window !== 'undefined' && typeof document !== 'undefined';

  /** Handlers que se registran en scroll/resize para el fallback del parallax. */
  private scrollHandler?: () => void;
  private resizeHandler?: () => void;

  // ============================================================
  // 4) ngOnInit: carga de datos y configuración del layout
  // ============================================================

  /**
   * Carga los datos del home y agrega la clase `has-hero` al <body>.
   * Esta clase permite aplicar estilos globales que solo se usan en esta vista
   * (por ejemplo, la superposición del header sobre el hero).
   */
  ngOnInit(): void {
    if (!this.isBrowser) return;

    // Añadimos una clase especial al body para estilos del home.
    document.body.classList.add('has-hero');

    // ------------------------------------------
    // 🟦 TUTORES reales desde TutorService
    // ------------------------------------------
    this.tutorItems = this.tutorService.getAll();

    // ------------------------------------------
    // 🔥 Resto de carruseles desde CarouselDataService
    // ------------------------------------------
    this.productItems = this.dataService.getProductItems();
    this.courseItems = this.dataService.getCourseItems();
    this.highlightItems = this.dataService.getHighlightItems();
    this.offerItems = this.dataService.getOfferItems();
    this.newsItems = this.dataService.getNewsItems();
  }

  // ============================================================
  // 5) ngAfterViewInit: animaciones + fallback parallax
  // ============================================================

  /**
   * Activa animaciones de entrada (fade-up) y fallback para el hero parallax
   * en navegadores que no soportan scroll-timeline.
   *
   * Esta sección está muy separada del OnInit para evitar
   * tocar el DOM antes de tiempo.
   */
  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    // ----------------------------------------------------------
    // A) Animación fade-up mediante IntersectionObserver
    // ----------------------------------------------------------

    const els = document.querySelectorAll<HTMLElement>('.fade-up');

    // Si el soporte es limitado, dejamos visibles los elementos.
    if (!('IntersectionObserver' in window) || !els.length) {
      els.forEach((e) => e.classList.add('is-visible'));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              (entry.target as HTMLElement).classList.add('is-visible');
              io.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '0px 0px -10% 0px',
          threshold: 0.1,
        }
      );

      els.forEach((el) => io.observe(el));
    }

    // ----------------------------------------------------------
    // B) Fallback parallax si NO hay soporte para scroll-timeline
    // ----------------------------------------------------------

    const supportsScrollLinked =
      (window as any).CSS?.supports?.('animation-timeline: scroll()');

    if (!supportsScrollLinked) {
      const header = document.getElementById('sticky-parallax-header');
      const fadingEls = document.querySelectorAll<HTMLElement>('.hero-fade');
      if (!header) return;

      const vh = () =>
        Math.max(
          document.documentElement.clientHeight,
          window.innerHeight || 0
        );

      const clamp = (v: number, min: number, max: number) =>
        Math.max(min, Math.min(max, v));

      // Handler que controla opacidad y desplazamiento del hero.
      this.scrollHandler = () => {
        const y = window.scrollY || document.documentElement.scrollTop || 0;
        const h = vh();

        const elemStart = 0.6 * h;
        const elemEnd = 0.95 * h;
        const headStart = 0.65 * h;
        const headEnd = 1.0 * h;

        const pElem = clamp((y - elemStart) / (elemEnd - elemStart), 0, 1);
        const pHead = clamp((y - headStart) / (headEnd - headStart), 0, 1);

        fadingEls.forEach((el) => {
          el.style.opacity = (1 - pElem).toFixed(4);
          el.style.transform = `translateY(${-30 * pElem}px)`;
        });

        header.style.opacity = (1 - pHead).toFixed(4);
      };

      // Listener de resize para recalcular rangos.
      this.resizeHandler = () => {
        if (this.scrollHandler) this.scrollHandler();
      };

      // Ejecutar una vez.
      this.scrollHandler();

      // Registrar listeners.
      window.addEventListener('scroll', this.scrollHandler, { passive: true });
      window.addEventListener('resize', this.resizeHandler);
    }
  }

  // ============================================================
  // 6) ngOnDestroy: limpieza de estado global
  // ============================================================

  /**
   * Elimina la clase global del body y limpia listeners registrados
   * durante el fallback del parallax.
   */
  ngOnDestroy(): void {
    if (!this.isBrowser) return;

    document.body.classList.remove('has-hero');

    // Remover listeners si estaban activos
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
      this.scrollHandler = undefined;
    }

    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
      this.resizeHandler = undefined;
    }
  }
}
