// src/app/shared/components/carousel/carousel.ts

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TutorCardComponent } from '@shared/components/tutor-card/tutor-card';
import { CarouselType, CarouselInputItem } from './carousel.types';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, TutorCardComponent],
  templateUrl: './carousel.html',
  styleUrls: ['./carousel.css'],
})
export class Carousel implements OnChanges {
  // ============================================================
  // 1) INPUTS / CONFIGURACIÓN DEL CARRUSEL
  // ============================================================

  /**
   * items
   * -----
   * Arreglo de elementos que se mostrarán dentro del carrusel.
   * Cada item puede representar:
   *  - producto
   *  - curso
   *  - noticia
   *  - oferta
   *  - tutor (en cuyo caso se usa <app-tutor-card>)
   */
  @Input() items: CarouselInputItem[] = [];

  /**
   * type
   * ----
   * Tipo de carrusel:
   *  - 'product'   → layout para productos
   *  - 'course'    → layout para cursos
   *  - 'highlight' → destacados
   *  - 'offer'     → ofertas
   *  - 'news'      → novedades / noticias
   *  - 'tutor'     → usa TutorCardComponent
   *
   * Se ha tipado como `CarouselType | string` para permitir
   * extensiones futuras sin romper el componente.
   */
  @Input() type: CarouselType | string = 'product';

  /**
   * itemsPerSlide
   * -------------
   * Cuántas cards se mostrarán en cada "slide" del carrusel.
   * Ejemplos:
   *  - 1 → 1 card por slide
   *  - 3 → 3 cards por slide, etc.
   */
  @Input() itemsPerSlide = 3;

  /**
   * colClass
   * --------
   * (Opción avanzada)
   * Permite inyectar clases Bootstrap personalizadas para las columnas
   * (por ejemplo: 'col-12 col-md-6 col-lg-3').
   * Si no se usa, el componente calcula las clases según itemsPerSlide.
   */
  @Input() colClass?: string | string[];

  /**
   * carouselId
   * ----------
   * ID único del carrusel.
   * Se usa para vincular los controles (prev/next) con data-bs-target.
   * Por defecto genera un valor pseudo-aleatorio.
   */
  @Input() carouselId: string =
    'carousel-' + Math.random().toString(36).substring(2, 9);

  /**
   * slides
   * ------
   * Estructura interna que agrupa los items por "páginas".
   * Es un arreglo de arreglos:
   *  [
   *    [ item1, item2, item3 ],     // slide 1
   *    [ item4, item5, item6 ],     // slide 2
   *    ...
   *  ]
   */
  slides: CarouselInputItem[][] = [];

  // ============================================================
  // 2) CICLO DE VIDA
  // ============================================================

  /**
   * ngOnChanges
   * -----------
   * Se dispara cuando cambian los @Input del componente.
   * Aquí reconstruimos las slides si cambian:
   *  - items
   *  - itemsPerSlide
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] || changes['itemsPerSlide']) {
      this.buildSlides();
    }
  }

  // ============================================================
  // 3) CONSTRUCCIÓN DE SLIDES (chunks)
  // ============================================================

  /**
   * buildSlides
   * -----------
   * Toma el arreglo de `items` y lo divide en bloques del tamaño
   * indicado por `itemsPerSlide`.
   *
   * Ejemplo:
   *  items = [a,b,c,d,e], itemsPerSlide = 2
   *  slides = [
   *    [a,b],
   *    [c,d],
   *    [e]
   *  ]
   */
  private buildSlides(): void {
    // Aseguramos al menos 1 item por slide
    const perSlide = Math.max(1, this.itemsPerSlide || 1);

    // Limpiamos slides anteriores
    this.slides = [];

    // Si no hay items, no hay nada que hacer
    if (!this.items || this.items.length === 0) {
      return;
    }

    // Cortamos el array original en "chunks" de tamaño perSlide
    for (let i = 0; i < this.items.length; i += perSlide) {
      this.slides.push(this.items.slice(i, i + perSlide));
    }
  }

  // ============================================================
  // 4) LAYOUT / RESPONSIVE
  // ============================================================

  /**
   * getColStyle
   * -----------
   * Alternativa basada en estilos inline (flex basis) para ajustar
   * el ancho de las columnas según itemsPerSlide.
   *
   * Actualmente no se usa en el template, pero queda disponible
   * si prefieres un layout 100% basado en flex en lugar de clases.
   */
  getColStyle() {
    const perSlide = Math.max(1, this.itemsPerSlide || 1);
    const width = 100 / perSlide; // porcentaje exacto del ancho

    return {
      flex: `0 0 ${width}%`,
      'max-width': `${width}%`,
    };
  }

  /**
   * getColClass
   * -----------
   * Devuelve clases Bootstrap adaptadas al número de items por slide.
   *
   * Mapa:
   *  - 1 → col-12 (1 card por fila)
   *  - 2 → col-12 col-sm-6 col-lg-6 (2 por fila en desktop)
   *  - 3 → col-12 col-sm-6 col-lg-4 (3 por fila en desktop)
   *  - 4 → col-12 col-sm-6 col-lg-3 (4 por fila en desktop)
   */
  getColClass(): string {
    switch (this.itemsPerSlide) {
      case 1:
        // 1 card por fila
        return 'col-12';

      case 2:
        // 2 cards por fila
        return 'col-12 col-sm-6 col-lg-6';

      case 3:
        // 3 cards por fila
        return 'col-12 col-sm-6 col-lg-4';

      case 4:
      default:
        // 4 cards por fila
        return 'col-12 col-sm-6 col-lg-3';
    }
  }

  // ============================================================
  // 5) TRACKBY PARA *ngFor
  // ============================================================

  /**
   * trackById
   * ---------
   * Optimiza el render de *ngFor en Angular.
   * Intenta usar la propiedad `id` del item si existe,
   * y si no, usa el índice como fallback.
   */
  trackById(index: number, item: CarouselInputItem): string {
    return (item as any).id ?? index.toString();
  }
}
