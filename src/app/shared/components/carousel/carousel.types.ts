// src/app/shared/components/carousel/carousel.types.ts

import { Tutor } from '@core/models/tutor.model';

/**
 * ============================================================
 *  TIPOS ADMITIDOS POR EL CARRUSEL
 * ============================================================
 *
 * El carrusel puede recibir distintos tipos de contenido:
 *
 *  - tutor       → usa <app-tutor-card> (layout especial)
 *  - product     → productos
 *  - course      → cursos
 *  - highlight   → destacados
 *  - offer       → ofertas
 *  - news        → noticias/novedades
 *
 * Esta unión define los valores válidos para <app-carousel [type]="...">
 */
export type CarouselType =
  | 'tutor'
  | 'product'
  | 'course'
  | 'highlight'
  | 'offer'
  | 'news';

/**
 * ============================================================
 *  INTERFAZ BASE PARA ÍTEMS "GENÉRICOS" DEL CARRUSEL
 * ============================================================
 *
 * CarouselItem representa el formato mínimo para los tipos
 * distintos de “tutor”.  
 *
 * Esto permite tener un solo carrusel que puede dibujar:
 *  - productos
 *  - cursos
 *  - ofertas
 *  - noticias
 *  - destacados
 *
 * Cada tipo usa distintas combinaciones de estas propiedades.
 */
export interface CarouselItem {
  /** ID único del elemento */
  id: string;

  /** Tipo de contenido → afecta la plantilla usada dentro del carrusel */
  type: CarouselType;

  /** Título principal */
  title: string;

  /** Subtítulo opcional (ej: “Guitarra eléctrica”, “Nivel intermedio”) */
  subtitle?: string;

  /** Descripción corta para cards pequeñas */
  description?: string;

  /** Imagen principal */
  imageUrl: string;

  /** Campos opcionales según el tipo de card */
  instrument?: string;   // productos o cursos
  location?: string;     // cursos / instructores
  level?: string;        // cursos
  rating?: number;       // reviews, productos, cursos

  /** Precios para productos / ofertas / cursos */
  price?: number;
  previousPrice?: number;

  /** Badge visual (“Nuevo”, “-20%”, “Destacado”) */
  badge?: string;

  /** Etiqueta de fecha para noticias */
  dateLabel?: string;

  /** CTA personalizada (botón dentro de la card) */
  ctaLabel?: string;
  ctaLink?: string;
}

/**
 * ============================================================
 *  TIPO FINAL QUE ACEPTA EL CARRUSEL
 * ============================================================
 *
 * CarouselInputItem puede ser:
 *
 *   - CarouselItem (estructura genérica)
 *   - Tutor (modelo completo del sistema)
 *
 * Si el item es un Tutor:
 *   El carrusel automáticamente usará <app-tutor-card>.
 *
 * Si es CarouselItem:
 *   El carrusel usará la plantilla específica de su type.
 */
export type CarouselInputItem = CarouselItem | Tutor;
