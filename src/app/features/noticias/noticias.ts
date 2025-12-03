
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewsService } from '@core/services/news.service';
import { NewsCard } from '@shared/components/news-card/news-card';
import { FadeUpDirective } from '@shared/directives/fade-up';

/**
 * Página principal del módulo de Noticias.
 *
 * Esta vista:
 * - Obtiene la lista completa de noticias desde `NewsService`.
 * - Renderiza cada item usando `<app-news-card>`.
 * - Aplica animaciones suaves de entrada mediante `FadeUpDirective`.
 *
 * La responsabilidad de este componente es mínima:
 * solo listar noticias de forma ordenada y delegar la visualización al card.
 *
 * @usageNotes
 * - Si en el futuro integras paginación o filtrado, este será el componente ideal.
 * - Puede extenderse para mostrar categorías, tags o búsquedas.
 * - Actualmente la data es local (mock), pero el flujo es idéntico a usar una API real.
 *
 * @example
 * <!-- Uso en rutas -->
 * {
 *   path: 'noticias',
 *   loadComponent: () => import('./featured/noticias/noticias').then(c => c.Noticias)
 * }
 */
@Component({
  selector: 'app-noticias',
  standalone: true,
  templateUrl: './noticias.html',
  styleUrls: ['./noticias.css'],
  imports: [CommonModule, NewsCard, FadeUpDirective],
})
export class Noticias {

  // ============================================================
  // SERVICIO PARA OBTENER LA DATA
  // ============================================================

  /**
   * Servicio centralizado que expone:
   * - getAll(): todas las noticias
   * - getById(): una noticia puntual
   *
   * Se inyecta usando la API moderna de Angular (`inject()`).
   */
  private newsService = inject(NewsService);

  // ============================================================
  // LISTA COMPLETA DE NOTICIAS EXPUESTA AL TEMPLATE
  // ============================================================

  /**
   * Listado completo de noticias que alimenta el template.
   * Se evalúa de inmediato porque:
   * - la data es local,
   * - y no requiere llamadas async ni Observables.
   *
   * @returns News[] — lista de noticias para mostrar.
   */
  noticias = this.newsService.getAll();
}
