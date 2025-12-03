
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { NewsService } from '@core/services/news.service';
import { News } from '@core/models/news.model';
import { FadeUpDirective } from '@shared/directives/fade-up';

/**
 * Vista de detalle para una noticia específica.
 *
 * Este componente:
 * - Obtiene el ID desde la URL (param :id).
 * - Busca la noticia correspondiente en NewsService.
 * - Renderiza el contenido completo de la noticia.
 * - Construye un sidebar paginado con “otras noticias”.
 *
 * El objetivo es entregar una lectura limpia, con navegación interna
 * sin recargar el componente gracias a paramMap.
 *
 * @usageNotes
 * - Las páginas se recalculan cada vez que cambia el `id` en la URL.
 * - Este componente asume que NewsService.getAll() devuelve un arreglo inmutable.
 * - El sidebar utiliza paginación manual (sin pipes externos).
 *
 * @example
 * // Navegando entre noticias:
 * router.navigate(['/noticias', 'n3']);
 */
@Component({
  selector: 'app-noticias-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FadeUpDirective],
  templateUrl: './noticias-detail.html',
  styleUrls: ['./noticias-detail.css'],
})
export class NoticiaDetalle implements OnInit {
  // ============================================================
  // 1) INYECCIÓN DE DEPENDENCIAS
  // ============================================================

  /** ActivatedRoute → para leer el parámetro dinámico :id */
  private route = inject(ActivatedRoute);

  /** Servicio de noticias → provee búsqueda y listado completo */
  private newsService = inject(NewsService);

  // ============================================================
  // 2) STATE PRINCIPAL DEL DETALLE
  // ============================================================

  /** Noticia principal actualmente mostrada */
  noticia?: News;

  /** Noticias visibles en la barra lateral (paginadas) */
  otrasNoticias: News[] = [];

  /** Arreglo base de “otras noticias” (sin paginar) */
  private allOther: News[] = [];

  /** Página actual del sidebar */
  page = 1;

  /** Cantidad de noticias por página */
  pageSize = 10;

  /** Cantidad total de páginas */
  totalPages = 1;

  // ============================================================
  // 3) CICLO DE VIDA: ngOnInit
  // ============================================================

  /**
   * Inicializa el componente:
   * - Lee el ID desde la URL.
   * - Obtiene la noticia correspondiente.
   * - Calcula las noticias restantes para el sidebar.
   * - Inicializa la paginación.
   *
   * @returns void
   */
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id) return;

      // Listado completo
      const all = this.newsService.getAll();

      // Noticia actual
      this.noticia = this.newsService.getById(id) || undefined;

      // Construcción de sidebar excluyendo la noticia actual
      this.allOther = all.filter(n => n.id !== id);

      // Total de páginas para el sidebar
      this.totalPages = Math.max(
        1,
        Math.ceil(this.allOther.length / this.pageSize)
      );

      // Reset a la primera página cuando cambia el ID
      this.setPage(1);
    });
  }

  // ============================================================
  // 4) PAGINACIÓN DEL SIDEBAR
  // ============================================================

  /**
   * Cambia la página actual del sidebar y calcula el slice visible.
   *
   * @param page Número de página que se desea mostrar.
   * @returns void
   *
   * @example
   * this.setPage(2); // Muestra la segunda página de noticias
   */
  setPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;

    this.page = page;

    const start = (page - 1) * this.pageSize;

    this.otrasNoticias = this.allOther.slice(
      start,
      start + this.pageSize
    );
  }

  /**
   * Navega a la página anterior (si existe).
   *
   * @returns void
   */
  goPrev(): void {
    if (this.page > 1) {
      this.setPage(this.page - 1);
    }
  }

  /**
   * Navega a la página siguiente (si existe).
   *
   * @returns void
   */
  goNext(): void {
    if (this.page < this.totalPages) {
      this.setPage(this.page + 1);
    }
  }
}
