
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TutorCardComponent } from '@shared/components/tutor-card/tutor-card';
import { CarouselType, CarouselInputItem } from './carousel.types';

/**
 * ============================================================================
 * @description
 * Componente de carrusel genérico y reutilizable.
 *
 * Admite distintos tipos de contenido:
 *  - tutores     (Tutor)
 *  - productos   (CarouselItem)
 *  - cursos      (CarouselItem)
 *  - ofertas     (CarouselItem)
 *  - destacados  (CarouselItem)
 *  - noticias    (CarouselItem)
 *
 * El carrusel:
 *  - Recibe un arreglo de items ya preparados.
 *  - Los agrupa en "slides" según `itemsPerSlide`.
 *  - Usa `<app-tutor-card>` cuando el item es un Tutor.
 *  - Usa plantillas específicas en el HTML según `type`.
 *
 * @usageNotes
 * ```html
 * <app-carousel
 *   [items]="courseItems"
 *   type="course"
 *   [itemsPerSlide]="3">
 * </app-carousel>
 * ```
 */
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
   * @description
   * Arreglo de elementos que se mostrarán dentro del carrusel.
   *
   * Cada item puede representar:
   *  - producto
   *  - curso
   *  - noticia
   *  - oferta
   *  - destacado
   *  - tutor (modelo completo), en cuyo caso se usa `<app-tutor-card>`.
   *
   * @usageNotes
   * El componente asume que la data ya viene filtrada, ordenada
   * y limitada desde el exterior.
   */
  @Input() items: CarouselInputItem[] = [];

  /**
   * @description
   * Tipo de carrusel:
   *  - 'product'   → layout para productos
   *  - 'course'    → layout para cursos
   *  - 'highlight' → destacados
   *  - 'offer'     → ofertas
   *  - 'news'      → novedades / noticias
   *  - 'tutor'     → usa `<app-tutor-card>`
   *
   * @usageNotes
   * Tipado como `CarouselType | string` para permitir extensiones
   * futuras sin romper la firma pública.
   */
  @Input() type: CarouselType | string = 'product';

  /**
   * @description
   * Número de cards por slide.
   *
   * Ejemplos:
   *  - 1 → 1 card por slide
   *  - 3 → 3 cards por slide
   *
   * @usageNotes
   * Se usa tanto para construir los "chunks" de items como para
   * calcular clases CSS responsivas.
   */
  @Input() itemsPerSlide = 3;

  /**
   * @description
   * Clases CSS opcionales para las columnas Bootstrap.
   *
   * Si se proporciona, el template puede usarlas directamente para
   * controlar el layout (ej: `col-12 col-md-6 col-lg-3`).
   *
   * @usageNotes
   * Si no se define, el componente usa `getColClass()` para elegir
   * un layout predefinido según `itemsPerSlide`.
   */
  @Input() colClass?: string | string[];

  /**
   * @description
   * ID único del carrusel.
   *
   * Se utiliza para vincular los controles prev/next con
   * `data-bs-target` en el template.
   *
   * @example
   * ```html
   * <div [id]="carouselId" class="carousel slide" data-bs-ride="carousel">
   * ```
   */
  @Input() carouselId: string =
    'carousel-' + Math.random().toString(36).substring(2, 9);

  /**
   * @description
   * Estructura interna de slides:
   *
   * ```ts
   * [
   *   [ item1, item2, item3 ],  // slide 1
   *   [ item4, item5, item6 ],  // slide 2
   *   ...
   * ]
   * ```
   *
   * Cada sub-arreglo representa una "página" del carrusel.
   */
  slides: CarouselInputItem[][] = [];

  // ============================================================
  // 2) CICLO DE VIDA
  // ============================================================

  /**
   * @description
   * Se dispara cuando cambian los @Input del componente.
   *
   * Reconstruye las slides cuando cambian:
   *  - `items`
   *  - `itemsPerSlide`
   *
   * @param changes Cambios detectados por Angular en los inputs.
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
   * @description
   * Divide el arreglo de `items` en bloques del tamaño indicado
   * por `itemsPerSlide`.
   *
   * @example
   * ```ts
   * // items = [a,b,c,d,e], itemsPerSlide = 2
   * // resultado:
   * // [
   * //   [a,b],
   * //   [c,d],
   * //   [e]
   * // ]
   * ```
   *
   * @usageNotes
   * - Si no hay items, `slides` queda vacío.
   * - Siempre asegura al menos 1 item por slide.
   */
  private buildSlides(): void {
    const perSlide = Math.max(1, this.itemsPerSlide || 1);

    this.slides = [];

    if (!this.items || this.items.length === 0) {
      return;
    }

    for (let i = 0; i < this.items.length; i += perSlide) {
      this.slides.push(this.items.slice(i, i + perSlide));
    }
  }

  // ============================================================
  // 4) LAYOUT / RESPONSIVE
  // ============================================================

  /**
   * @description
   * Calcula un estilo inline para columnas flexibles basado en
   * `itemsPerSlide`.
   *
   * @returns Un objeto de estilos CSS con `flex` y `max-width`
   *          ajustados al porcentaje correspondiente.
   *
   * @usageNotes
   * Actualmente es opcional y puede usarse como alternativa a
   * las clases Bootstrap predefinidas.
   */
  getColStyle() {
    const perSlide = Math.max(1, this.itemsPerSlide || 1);
    const width = 100 / perSlide;

    return {
      flex: `0 0 ${width}%`,
      'max-width': `${width}%`,
    };
  }

  /**
   * @description
   * Devuelve clases Bootstrap adaptadas al número de items por slide.
   *
   * Mapeo:
   *  - 1 → `col-12`
   *  - 2 → `col-12 col-sm-6 col-lg-6`
   *  - 3 → `col-12 col-sm-6 col-lg-4`
   *  - 4+ → `col-12 col-sm-6 col-lg-3`
   *
   * @returns Cadena con clases CSS para la columna.
   */
  getColClass(): string {
    switch (this.itemsPerSlide) {
      case 1:
        return 'col-12';
      case 2:
        return 'col-12 col-sm-6 col-lg-6';
      case 3:
        return 'col-12 col-sm-6 col-lg-4';
      case 4:
      default:
        return 'col-12 col-sm-6 col-lg-3';
    }
  }

  // ============================================================
  // 5) TRACKBY PARA *ngFor
  // ============================================================

  /**
   * @description
   * Función trackBy para optimizar el render de listas en Angular.
   *
   * Intenta usar la propiedad `id` del item si existe; si no, usa
   * el índice como fallback.
   *
   * @param index Índice del item dentro del *ngFor.
   * @param item  Elemento actual del carrusel.
   * @returns Una clave única (string) para identificar el item.
   *
   * @example
   * ```html
   * <div *ngFor="let item of slide; trackBy: trackById">
   * ```
   */
  trackById(index: number, item: CarouselInputItem): string {
    return (item as any).id ?? index.toString();
  }
}
