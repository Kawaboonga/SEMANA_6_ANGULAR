// src/app/featured/noticias/noticias-detail/noticias-detail.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { NewsService } from '@core/services/news.service';
import { News } from '@core/models/news.model';
import { FadeUpDirective } from '@shared/directives/fade-up';

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
  // ActivatedRoute → para leer el parámetro :id de la URL
  private route = inject(ActivatedRoute);

  // NewsService → fuente de datos local para las noticias
  private newsService = inject(NewsService);

  // ============================================================
  // 2) STATE PRINCIPAL DE LA VISTA
  // ============================================================

  // Noticia que se muestra en el cuerpo principal de la página
  noticia?: News;

  // Sidebar: listado paginado de otras noticias
  otrasNoticias: News[] = [];

  // Este arreglo mantiene todas las otras noticias (sin paginar),
  // y desde aquí se calcula el slice para la página actual.
  private allOther: News[] = [];

  // Estado de paginación para el sidebar
  page = 1;        // página actual
  pageSize = 10;   // cantidad de noticias por página en el sidebar
  totalPages = 1;  // total de páginas calculadas

  // ============================================================
  // 3) CICLO DE VIDA: ngOnInit
  // ============================================================
  ngOnInit(): void {
    // Nos suscribimos a los cambios de parámetros de ruta.
    // Esto permite que, si navegamos entre noticias usando links dentro
    // del propio detalle, se actualice la vista sin recrear el componente.
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id) return;

      // Obtenemos todas las noticias desde el servicio
      const all = this.newsService.getAll();

      // Buscamos la noticia actual por id
      this.noticia = this.newsService.getById(id) || undefined;

      // Construimos el listado de "otras noticias" excluyendo la actual
      this.allOther = all.filter(n => n.id !== id);

      // Calculamos el total de páginas para el sidebar
      this.totalPages = Math.max(
        1,
        Math.ceil(this.allOther.length / this.pageSize)
      );

      // Siempre que cambia el id, reseteamos a la primera página
      this.setPage(1);
    });
  }

  // ============================================================
  // 4) LÓGICA DE PAGINACIÓN PARA EL SIDEBAR
  // ============================================================

  /**
   * Cambia la página actual del sidebar y recalcula
   * el slice de `otrasNoticias` que se va a mostrar.
   */
  setPage(page: number): void {
    // Validar que la página esté dentro del rango permitido
    if (page < 1 || page > this.totalPages) return;

    this.page = page;

    // Índice inicial para el slice
    const start = (page - 1) * this.pageSize;

    // Tomamos solo los elementos correspondientes a la página actual
    this.otrasNoticias = this.allOther.slice(start, start + this.pageSize);
  }

  //Ir a la página anterior (si existe)
  goPrev(): void {
    if (this.page > 1) {
      this.setPage(this.page - 1);
    }
  }

  //Ir a la página siguiente (si existe).
  goNext(): void {
    if (this.page < this.totalPages) {
      this.setPage(this.page + 1);
    }
  }
}
