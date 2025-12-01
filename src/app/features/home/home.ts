// src/app/features/home/home.ts (o ruta equivalente)

import {Component, AfterViewInit, OnInit, OnDestroy, inject,} from '@angular/core';
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
export class Home implements OnInit, AfterViewInit, OnDestroy {
  // ============================================================
  // 1) INYECCIÓN DE SERVICIOS
  // ============================================================
  private dataService = inject(CarouselDataService);
  private tutorService = inject(TutorService);

  // ============================================================
  // 2) DATA PARA CARRUSELES
  // ============================================================

  // 🟦 Ahora los tutores vienen desde TutorService (tutores reales)
  tutorItems: Tutor[] = [];

  // El resto de carruseles sigue usando el contrato CarouselItem
  productItems: CarouselItem[] = [];
  courseItems: CarouselItem[] = [];
  highlightItems: CarouselItem[] = [];
  offerItems: CarouselItem[] = [];
  newsItems: CarouselItem[] = [];

  // ============================================================
  // 3) CONTROL DE ENTORNO (solo navegador)
  //    → útil si algún día activas SSR
  // ============================================================
  private isBrowser =
    typeof window !== 'undefined' && typeof document !== 'undefined';

  // Handlers para limpiar listeners en ngOnDestroy
  private scrollHandler?: () => void;
  private resizeHandler?: () => void;

  // ============================================================
  // 4) ngOnInit: cargar datos + clase en <body>
  // ============================================================
  ngOnInit(): void {
    if (!this.isBrowser) return;

    // Clase en body para estilos específicos del home (hero, etc.)
    document.body.classList.add('has-hero');

    // -----------------------------
    // 🟦 TUTORES desde TutorService
    // -----------------------------
    // getAll() devuelve el arreglo de tutores que ya usas en admin
    this.tutorItems = this.tutorService.getAll();

    // -----------------------------
    // 🔥 Resto de carruseles desde CarouselDataService
    // -----------------------------
    this.productItems = this.dataService.getProductItems();
    this.courseItems = this.dataService.getCourseItems();
    this.highlightItems = this.dataService.getHighlightItems();
    this.offerItems = this.dataService.getOfferItems();
    this.newsItems = this.dataService.getNewsItems();
  }

  // ============================================================
  // 5) ngAfterViewInit: animaciones fade + fallback parallax
  // ============================================================
  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    // ----------------------------------------------------------
    // A) Fallback simple para elementos .fade-up
    //    (si no hay IntersectionObserver, los dejamos visibles)
    //    → esto convive con tu directiva appFadeUp si la usas.
    // ----------------------------------------------------------
    const els = document.querySelectorAll<HTMLElement>('.fade-up');
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
    // B) Fallback para hero parallax si NO hay scroll-timeline
    // ----------------------------------------------------------
    const supportsScrollLinked =
      (window as any).CSS &&
      (window as any).CSS.supports &&
      (window as any).CSS.supports('animation-timeline: scroll()');

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

      // Handler de scroll (lo guardamos en propiedad para poder removerlo)
      this.scrollHandler = () => {
        const y =
          window.scrollY || document.documentElement.scrollTop || 0;
        const h = vh();

        // Rangos de scroll donde se anima el contenido y el header
        const elemStart = 0.6 * h;
        const elemEnd = 0.95 * h;
        const headStart = 0.65 * h;
        const headEnd = 1.0 * h;

        const pElem = clamp((y - elemStart) / (elemEnd - elemStart), 0, 1);
        const pHead = clamp((y - headStart) / (headEnd - headStart), 0, 1);

        // Atenuar y levantar elementos hero-fade
        fadingEls.forEach((el) => {
          el.style.opacity = (1 - pElem).toFixed(4);
          el.style.transform = `translateY(${-30 * pElem}px)`;
        });

        // Atenuar header sticky
        header.style.opacity = (1 - pHead).toFixed(4);
      };

      // Handler de resize → recalcula en base al nuevo viewport
      this.resizeHandler = () => {
        if (this.scrollHandler) {
          this.scrollHandler();
        }
      };

      // Ejecutamos una vez para estado inicial
      this.scrollHandler();

      // Registramos listeners
      window.addEventListener('scroll', this.scrollHandler, { passive: true });
      window.addEventListener('resize', this.resizeHandler);
    }
  }

  // ============================================================
  // 6) ngOnDestroy: limpiar clases y listeners
  // ============================================================
  ngOnDestroy(): void {
    if (!this.isBrowser) return;

    // Quitar clase de body
    document.body.classList.remove('has-hero');

    // Limpiar listeners de scroll/resize si se registraron
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
