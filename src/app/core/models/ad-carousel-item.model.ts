// src/app/core/models/carousel-item.model.ts

// Tipos de contenido que pueden aparecer en el carrusel del home.
// Esto permite que el mismo componente soporte distintos modelos (tutor, producto, curso, noticia...).
export type CarouselItemType =
  | 'tutor'
  | 'product'
  | 'course'
  | 'highlight'
  | 'offer'
  | 'news';

// Modelo base para los items que se muestran en el carrusel.
// Lo uso como interfaz genérica para reutilizar el mismo componente visual.
export interface CarouselItem {
  id: string;                  
  // ID del elemento que se va a mostrar.

  type: CarouselItemType;      
  // Tipo de item (tutor, producto, curso, noticia...).
  // Esto permite que el carrusel pueda renderizar condicionalmente info específica.

  title: string;               
  // Título principal del item.

  subtitle?: string;           
  // Texto secundario, útil en algunos tipos de contenido.

  description?: string;        
  // Descripción breve para resúmenes dentro del carrusel.

  imageUrl: string;            
  // Imagen principal que aparece en la tarjeta del carrusel.

  // ---- Campos opcionales que se muestran según el tipo ----

  instrument?: string;         
  // Usado especialmente para tutores.

  location?: string;           
  // Para productos o eventos que dependen de ubicación.

  level?: string;              
  // Nivel de dificultad (principalmente para cursos).

  rating?: number;             
  // Para mostrar estrellas cuando aplica.

  // ---- Precios (productos u ofertas) ----

  price?: number;              
  previousPrice?: number;      
  // price y previousPrice permiten mostrar ofertas dentro del carrusel.

  badge?: string;              
  // Pequeño texto o etiqueta visual: "Nuevo", "Oferta", etc.

  // ---- Noticias ----

  dateLabel?: string;          
  // Fecha formateada cuando el item es de tipo 'news'.

  // ---- CTA (Call to Action) ----

  ctaLabel?: string;           
  // Texto del botón: "Ver más", "Inscribirme", "Comprar", etc.

  ctaLink?: string;            
  // Ruta a donde redirige el CTA.
}
