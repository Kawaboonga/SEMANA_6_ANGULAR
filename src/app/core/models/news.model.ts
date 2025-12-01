import { CarouselItem } from '@shared/components/carousel/carousel.types';

// Modelo específico para Noticias.
// Extiende CarouselItem porque también se muestran en el carrusel del home
// (lo que hace que compartan campos como id, slug, title, imageUrl, etc.)
export interface News extends CarouselItem {
  // Fijo el tipo a 'news' para que el carrusel y otros componentes
  // puedan distinguir qué tipo de item están mostrando.
  type: 'news';

  // Fecha de publicación en formato ISO (YYYY-MM-DD).
  // Me sirve para ordenar noticias por fecha y mostrarla en la UI.
  date: string;

  // Resumen corto para mostrar en cards, listados o carruseles.
  excerpt: string;

  // Contenido completo de la noticia dividido en párrafos.
  // Esto evita tener un texto gigante en un solo string y facilita el render.
  content: string[];
}
