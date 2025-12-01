// ============================================================================
// NEWS CARD COMPONENT
// ----------------------------------------------------------------------------
// Tarjeta reutilizable para mostrar noticias en listados, carruseles u otros.
// - Recibe un objeto News (modelo real del proyecto).
// - Se usa principalmente en la vista de noticias y en sliders/carouseles.
// - Mantiene estructura minimalista para poder usarse dentro de grids.
// ============================================================================

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { News } from '@core/models/news.model'; // 👉 Modelo real de noticia

@Component({
  selector: 'app-news-card',
  standalone: true,

  // Módulos necesarios para routerLink y directivas comunes
  imports: [CommonModule, RouterLink],

  templateUrl: './news-card.html',
  styleUrls: ['./news-card.css'],
})
export class NewsCard {

  // ==========================================================================
  // INPUTS
  // ==========================================================================

  /**
   * Objeto de noticia recibido desde la lista o carrusel.
   * Debe ser el modelo News real:
   * { id, title, subtitle, imageUrl, createdAt, content, ... }
   *
   * Se marca como obligatorio (!).
   */
  @Input({ required: true })
  item!: News;
}
