import { Injectable } from '@angular/core';
import { News } from '@core/models/news.model';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  // Lista local de noticias.
  // Estas noticias se usan tanto en el carrusel del home como en la sección de "Noticias".
  // Más adelante esto puede venir desde una API o un JSON externo.
  private news: News[] = [
    {
      id: 'n1',
      type: 'news',  // requerido por el modelo News/CarouselItem para identificar el tipo

      // Campos base compartidos con el carrusel
      title: 'Lanzamiento oficial de SoundSeeker',
      subtitle: 'Comunidad de tutores y alumnos',
      imageUrl:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80',

      // Campos específicos de noticias + mapeo a carrusel
      date: '2025-11-26',              // fecha "real" de la noticia (ISO)
      dateLabel: '26-11-2025',         // fecha formateada para el badge en la UI
      excerpt: 'Conecta con tutores de tu comuna y encuentra tu sonido.',
      description: 'Conecta con tutores de tu comuna y encuentra tu sonido.', // texto breve que ve el carrusel/card
      ctaLabel: 'Leer más',            // texto del botón de acción

      // Contenido extendido para la página de detalle de la noticia.
      content: [
        'Primer párrafo...',
        'Segundo párrafo...',
        'Tercer párrafo...',
      ],
    },
    {
      id: 'n2',
      type: 'news',

      title: 'Nueva categoría: pedales de bajo',
      subtitle: 'Más opciones para tu low end',
      imageUrl:
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=900&q=80',

      date: '2025-11-12',
      dateLabel: '12-11-2025',
      excerpt: 'Explora filtros, distorsiones y compresores.',
      description: 'Explora filtros, distorsiones y compresores.',
      ctaLabel: 'Leer más',

      content: ['Texto largo...'],
    },

    {
      id: 'n3',
      type: 'news',

      title: 'Nueva categoría: pedales de bajo',
      subtitle: 'Más opciones para tu low end',
      imageUrl:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80',

      date: '2025-11-12',
      dateLabel: '12-11-2025',
      excerpt: 'Explora filtros, distorsiones y compresores.',
      description: 'Explora filtros, distorsiones y compresores.',
      ctaLabel: 'Leer más',

      content: ['Texto largo...'],
    },
    // puedes seguir agregando más noticias con la misma estructura
  ];

  // Devuelve todas las noticias.
  // Se usa para el listado general o para armar el carrusel de noticias.
  getAll(): News[] {
    return this.news;
  }

  // Busca una noticia por ID.
  // Ideal para la página de detalle: /noticias/:id o similar.
  getById(id: string): News | undefined {
    return this.news.find((n) => n.id === id);
  }
}
