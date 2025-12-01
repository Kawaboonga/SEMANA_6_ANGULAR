// src/app/featured/noticias/noticias.ts

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewsService } from '@core/services/news.service';
import { NewsCard } from '@shared/components/news-card/news-card';
import { FadeUpDirective } from '@shared/directives/fade-up';

/**
 * Componente principal del listado de Noticias.
 * 
 * - Muestra todas las noticias usando <app-news-card>.
 * - Obtiene los datos desde el servicio NewsService.
 * - Usa FadeUpDirective para animaciones de entrada.
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
  private newsService = inject(NewsService);

  // ============================================================
              // LISTA COMPLETA DE NOTICIAS PARA EL TEMPLATE
  // ============================================================
  noticias = this.newsService.getAll();
}
