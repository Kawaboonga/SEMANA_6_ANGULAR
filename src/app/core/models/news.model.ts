
import { CarouselItem } from '@shared/components/carousel/carousel.types';

/**
 * Modelo específico para una noticia.
 *
 * Extiende `CarouselItem` porque las noticias también pueden aparecer
 * en el carrusel del home, por lo que comparten campos como:
 * - id
 * - slug
 * - title
 * - imageUrl
 *
 * Este modelo existe para diferenciar claramente una noticia
 * de otros tipos de datos como cursos, productos o servicios.
 *
 * @usageNotes
 * - `type` siempre es `'news'` para que el carrusel y otros componentes
 *   puedan identificar el tipo de item sin lógica adicional.
 * - `content` se maneja como arreglo para evitar textos gigantes en un solo string
 *   y poder renderizar párrafos de forma limpia.
 * - `date` permite ordenar noticias recientes y mostrar la fecha en la interfaz.
 *
 * @example
 * const noticia: News = {
 *   id: 'n1',
 *   slug: 'nuevo-curso-guitarra',
 *   title: 'Nuevo curso de guitarra disponible',
 *   imageUrl: '/assets/img/news/guitarra.jpg',
 *   type: 'news',
 *   date: '2025-01-18',
 *   excerpt: 'Ya está disponible el nuevo curso de guitarra rock...',
 *   content: [
 *     'Primer párrafo...',
 *     'Segundo párrafo...',
 *   ]
 * };
 */
export interface News extends CarouselItem {
  /**
   * Tipo fijo del item.
   * Sirve para que el carrusel y otros componentes sepan que este item es una noticia.
   */
  type: 'news';

  /**
   * Fecha de publicación en formato ISO (YYYY-MM-DD).
   * Útil para ordenar noticias y mostrarla en la UI.
   */
  date: string;

  /**
   * Resumen breve que se muestra en cards, listados y carruseles.
   */
  excerpt: string;

  /**
   * Contenido completo de la noticia dividido en párrafos.
   * Permite renderizar textos largos de forma ordenada.
   */
  content: string[];
}
