// ============================================================================
// NEWS CARD COMPONENT
// ----------------------------------------------------------------------------
// Tarjeta reutilizable para mostrar noticias en listados, carruseles u otros.
//
// - Recibe un objeto News (modelo real del proyecto).
// - Click navega al detalle mediante routerLink.
// - Es un componente completamente presentacional (dumb component).
// - No hace lógica de negocio ni transforma datos.
//
// Se utiliza en:
//   • Listado de noticias (grid principal)
//   • Carrusel de noticias destacadas
//   • Secciones de sidebar / relacionadas
// ============================================================================

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { News } from '@core/models/news.model';

@Component({
  selector: 'app-news-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './news-card.html',
  styleUrls: ['./news-card.css'],
})
export class NewsCard {

  // ==========================================================================
  // INPUT PRINCIPAL
  // ==========================================================================

  /**
   * @property item
   * @description
   * Noticia que se va a representar visualmente en la card.
   *
   * Este input debe ser siempre una instancia válida del modelo `News`,
   * que incluye:
   *   - id
   *   - slug
   *   - title
   *   - imageUrl
   *   - date (YYYY-MM-DD)
   *   - excerpt
   *   - content[]
   *   - type: "news"
   *
   * @usageNotes
   * • Esta card NO transforma ni filtra el contenido.
   * • Toda la lógica de paginación, filtrado o selección ocurre fuera.
   *
   * @example
   * <app-news-card [item]="n"></app-news-card>
   */
  @Input({ required: true })
  item!: News;
}
