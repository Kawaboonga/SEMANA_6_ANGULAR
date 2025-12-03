
import { Tutor } from '@core/models/tutor.model';

/**
 * ========================================================================
 * @description
 * Enumeración de tipos válidos que puede recibir el carrusel.
 *
 * El carrusel es un componente genérico capaz de renderizar:
 *  - tutores          → usa <app-tutor-card>
 *  - productos        → usa card interna del carrusel
 *  - cursos           → idem
 *  - destacados       → highlight
 *  - ofertas          → offer
 *  - noticias         → news
 *
 * Cada tipo activa una plantilla específica dentro del componente Carousel.
 *
 * @usageNotes
 * Usado como:
 * ```html
 * <app-carousel [type]="'course'"></app-carousel>
 * ```
 */
export type CarouselType =
  | 'tutor'
  | 'product'
  | 'course'
  | 'highlight'
  | 'offer'
  | 'news';


/**
 * ========================================================================
 * @description
 * Interface base para todos los ítems que NO son tutores.
 *
 * Proporciona un formato unificado que el carrusel puede interpretar,
 * sin importar si pertenece a un producto, curso, noticia, oferta, etc.
 *
 * Los distintos tipos utilizan diferentes subconjuntos de estas props.
 *
 * @example
 * ```ts
 * const item: CarouselItem = {
 *   id: 'p1',
 *   type: 'product',
 *   title: 'Pedal Overdrive',
 *   description: 'Ganancia suave y armónica',
 *   imageUrl: '/img/od.jpg',
 *   price: 45000,
 *   previousPrice: 60000,
 * };
 * ```
 *
 * @usageNotes
 * El carrusel NO conoce la estructura real de cada modelo.
 * Solo espera este contrato común para construir la tarjeta adecuada.
 */
export interface CarouselItem {
  /** ID único del elemento */
  id: string;

  /** Tipo de contenido → determina qué plantilla usa el carrusel */
  type: CarouselType;

  /** Título visible en la tarjeta */
  title: string;

  /** Subtítulo opcional (ej: “Nivel intermedio”, “Guitarra eléctrica”) */
  subtitle?: string;

  /** Descripción corta para vistas compactas */
  description?: string;

  /** Imagen principal del ítem */
  imageUrl: string;

  // ---------------------------------------------------------------------
  // Campos opcionales según el tipo:
  // ---------------------------------------------------------------------

  /** Instrumento relacionado (tutores/productos/cursos) */
  instrument?: string;

  /** Ubicación relevante (cursos presenciales / instructores) */
  location?: string;

  /** Nivel de dificultad (cursos) */
  level?: string;

  /** Rating promedio (cursos/productos/tutores) */
  rating?: number;

  /** Precio actual (items con compra) */
  price?: number;

  /** Precio anterior, usado para mostrar descuentos */
  previousPrice?: number;

  /** Badge visual destacado (“Nuevo”, “-20%”, “Oferta”) */
  badge?: string;

  /** Fecha formateada para noticias */
  dateLabel?: string;

  /** CTA textual (“Ver más”, “Comprar”, “Leer noticia”) */
  ctaLabel?: string;

  /** Ruta de navegación para el CTA */
  ctaLink?: string;
}


/**
 * ========================================================================
 * @description
 * Tipo final que acepta el carrusel como elemento de entrada.
 *
 * Permite dos posibilidades:
 *
 *  1) **Tutor** (modelo completo)
 *     → El carrusel automáticamente usa `<app-tutor-card>`.
 *
 *  2) **CarouselItem**
 *     → El carrusel usa la plantilla específica según `type`.
 *
 * Esto permite un único carrusel universal para toda la app.
 *
 * @example
 * ```ts
 * items: CarouselInputItem[] = [
 *   tutorMarcoVidal,
 *   { id:'p1', type:'product', title:'Amplificador', imageUrl:'...' },
 *   { id:'n1', type:'news', title:'Nuevo pedal', dateLabel:'Hoy', imageUrl:'...' }
 * ];
 * ```
 */
export type CarouselInputItem = CarouselItem | Tutor;
