import { Injectable } from '@angular/core';
import { News } from '@core/models/news.model';

@Injectable({
  providedIn: 'root',
})
/**
 * Servicio encargado de manejar las noticias del proyecto.
 *
 * Por ahora funciona con una lista estática declarada en el propio servicio,
 * pero está pensado para reemplazarse fácilmente por:
 * - una API externa,
 * - un archivo JSON,
 * - o un backend real.
 *
 * Se usa en:
 * - el carrusel del home,
 * - la sección completa de “Noticias”,
 * - las páginas de detalle de cada noticia.
 *
 * @usageNotes
 * - Cada noticia incluye campos del modelo base `CarouselItem` + campos propios.
 * - `date` es la fecha real en ISO; `dateLabel` es la versión formateada para UI.
 * - Mantener el tipo fijo `"news"` permite que el carrusel sepa cómo mostrarlo.
 *
 * @example
 * // En un componente:
 * const noticias = this.newsService.getAll();
 *
 * @example
 * // Para detalle:
 * const noticia = this.newsService.getById('n1');
 */
export class NewsService {
  /**
   * Lista local de noticias.
   *
   * Se usa tanto en el carrusel como en el listado completo.
   * Cada noticia contiene:
   * - id
   * - type: 'news'
   * - título, subtítulo, imagen
   * - fecha real + fecha formateada
   * - excerpt y descripción breve
   * - contenido extendido para la página de detalle
   * - CTA opcional para navegar
   */
  private news: News[] = [
    {
      id: 'n1',
      type: 'news',

      // Campos base del carrusel
      title: 'Lanzamiento oficial de SoundSeeker',
      subtitle: 'Comunidad de tutores y alumnos',
      imageUrl:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80',

      // Campos propios del modelo News
      date: '2025-11-26',
      dateLabel: '26-11-2025',
      excerpt: 'Conecta con tutores de tu comuna y encuentra tu sonido.',
      description: 'Conecta con tutores de tu comuna y encuentra tu sonido.',
      ctaLabel: 'Leer más',

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
  ];

  /**
   * Devuelve todas las noticias.
   * Ideal para el listado general y para generar el carrusel.
   *
   * @returns News[]
   *
   * @example
   * const lista = this.newsService.getAll();
   */
  getAll(): News[] {
    return this.news;
  }

  /**
   * Busca una noticia específica usando su ID.
   * Usado directamente en la página de detalle: `/noticias/:id`.
   *
   * @param id ID de la noticia
   * @returns News | undefined
   *
   * @example
   * const noticia = this.newsService.getById('n2');
   */
  getById(id: string): News | undefined {
    return this.news.find((n) => n.id === id);
  }
}
