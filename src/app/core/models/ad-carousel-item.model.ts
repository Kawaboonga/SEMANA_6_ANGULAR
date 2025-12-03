
/**
 * Tipos de contenido que pueden aparecer en el carrusel del home.
 *
 * Esto permite que el carrusel soporte múltiples modelos sin romper la UI:
 * - tutores,
 * - productos,
 * - cursos,
 * - noticias,
 * - destacados del home,
 * - ofertas.
 *
 * @usageNotes
 * - El tipo se usa para renderizar vistas condicionales dentro del carrusel.
 * - Mantén estos valores sincronizados con cualquier lógica del componente.
 *
 * @example
 * const type: CarouselItemType = 'product';
 */
export type CarouselItemType =
  | 'tutor'
  | 'product'
  | 'course'
  | 'highlight'
  | 'offer'
  | 'news';

/**
 * Modelo base genérico para todos los elementos que se muestran en el carrusel.
 *
 * La idea es tener una interfaz flexible que permita reutilizar el mismo
 * componente visual para distintos tipos de contenido sin duplicar código.
 *
 * El carrusel utiliza este modelo para decidir:
 * - qué mostrar,
 * - cómo mostrarlo,
 * - qué campos opcionales incluir según el tipo.
 *
 * @usageNotes
 * - Los campos opcionales se muestran solo si el tipo de item lo requiere.
 * - Mantener este modelo genérico hace que agregar nuevos tipos de contenido
 *   al carrusel sea mucho más simple.
 * - `badge` es útil para destacar “Nuevo”, “Oferta”, “Recomendado”, etc.
 * - `ctaLabel` y `ctaLink` permiten usar el carrusel como una zona de acción.
 *
 * @example
 * const item: CarouselItem = {
 *   id: 'p1',
 *   type: 'product',
 *   title: 'Fender Stratocaster',
 *   imageUrl: '/assets/img/products/strato.jpg',
 *   price: 680000,
 *   ctaLabel: 'Ver producto',
 *   ctaLink: '/productos/fender-strato'
 * };
 */
export interface CarouselItem {
  id: string;
  // ID del elemento que se va a mostrar en el carrusel.

  type: CarouselItemType;
  // Tipo de contenido (tutor, producto, curso, noticia…).
  // Controla la lógica condicional en la UI.

  title: string;
  // Título principal del item. Siempre visible.

  subtitle?: string;
  // Subtítulo opcional. Útil para cursos, tutores o productos específicos.

  description?: string;
  // Descripción breve que puede acompañar al título dentro del carrusel.

  imageUrl: string;
  // Imagen principal mostrada en la tarjeta del carrusel.

  // ---- Campos opcionales según el tipo de item ----

  instrument?: string;
  // Usado casi siempre en perfiles de tutor.

  location?: string;
  // Para productos o eventos que dependen de ubicación.

  level?: string;
  // Nivel de dificultad (especialmente para cursos).

  rating?: number;
  // Nota promedio (tutores, cursos, productos).

  // ---- Precios (productos u ofertas) ----

  price?: number;
  previousPrice?: number;
  // Para manejar ofertas: antes / ahora.

  badge?: string;
  // Pequeño texto destacado: "Nuevo", "Oferta", etc.

  // ---- Noticias ----

  dateLabel?: string;
  // Fecha formateada para items de tipo noticia.

  // ---- CTA ----

  ctaLabel?: string;
  // Texto del botón. Ej: "Ver más", "Comprar", "Inscribirme".

  ctaLink?: string;
  // Ruta donde redirige el CTA.
}
