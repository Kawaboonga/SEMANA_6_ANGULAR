import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { ServiceService } from '@core/services/service.service';
import { Service } from '@core/models/service.model';

import { FadeUpDirective } from '@shared/directives/fade-up';

/**
 * Representa un item del breadcrumb.
 * - label: texto visible
 * - url: opcional (si no existe → item actual sin enlace)
 */
interface BreadcrumbItem {
  label: string;
  url?: string;
}

@Component({
  standalone: true,
  selector: 'app-servicio-detail',
  imports: [CommonModule, RouterModule, FadeUpDirective],
  templateUrl: './servicio-detail.html',
  styleUrl: './servicio-detail.css'
})
export class ServicioDetail {

  // ============================================================
  // INYECCIONES DE SERVICIOS Y RUTAS
  // ============================================================

  private route = inject(ActivatedRoute);    // Para leer el slug de la URL
  private router = inject(Router);           // Para redirecciones programáticas
  private serviceService = inject(ServiceService); // Fuente de datos de servicios

  // ============================================================
  // ESTADO LOCAL
  // ============================================================

  // Lista total de servicios (para sidebar y filtrado)
  services = this.serviceService.getAll();

  // Servicio actual mostrado en el detalle
  currentService = signal<Service | null>(null);

  // ============================================================
  // BREADCRUMB COMPUTADO
  // Dependiendo del servicio actual
  // ============================================================
  breadcrumbItems = computed<BreadcrumbItem[]>(() => {
    const current = this.currentService();
    return [
      { label: 'Inicio', url: '/' },
      { label: 'Servicios', url: '/servicios' },
      current
        ? { label: current.name }              // Último breadcrumb (sin URL)
        : { label: 'Servicio no encontrado' }
    ];
  });

  // ============================================================
  // CONSTRUCTOR — lee parámetros de la URL y carga el servicio
  // ============================================================
  constructor() {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');

      // Si no hay slug → no tiene sentido mostrar la vista → volver
      if (!slug) {
        this.router.navigate(['/servicios']);
        return;
      }

      // Buscar servicio por slug
      const s = this.serviceService.getBySlug(slug);

      // Si no existe → devolver al listado
      if (!s) {
        this.router.navigate(['/servicios']);
        return;
      }

      // Guardamos el servicio en el signal
      this.currentService.set(s);
    });
  }

  // ============================================================
  // SIDEBAR — lista de otros servicios distintos al actual
  // ============================================================
  get otherServices(): Service[] {
    const current = this.currentService();
    if (!current) return this.services;

    return this.services.filter(s => s.id !== current.id);
  }
}
