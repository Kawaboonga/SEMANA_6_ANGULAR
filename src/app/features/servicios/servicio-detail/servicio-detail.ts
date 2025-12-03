

import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { ServiceService } from '@core/services/service.service';
import { Service } from '@core/models/service.model';

import { FadeUpDirective } from '@shared/directives/fade-up';

/**
 * Representa un item del breadcrumb del detalle de servicio.
 *
 * @property {string} label - Texto visible en la ruta.
 * @property {string} [url] - URL navegable (si no existe, indica el item actual).
 *
 * @example
 * const item: BreadcrumbItem = {
 *   label: 'Servicios',
 *   url: '/servicios'
 * };
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
  styleUrl: './servicio-detail.css',
})
export class ServicioDetail {

  // ============================================================
  // INYECCIÓN DE SERVICIOS
  // ============================================================

  /**
   * ActivatedRoute para leer parámetros dinámicos como :slug.
   * @private
   */
  private route = inject(ActivatedRoute);

  /**
   * Router para redirecciones programáticas (404 → volver al listado).
   * @private
   */
  private router = inject(Router);

  /**
   * ServiceService → proveedor de la data de servicios.
   * @private
   */
  private serviceService = inject(ServiceService);

  // ============================================================
  // STATE PRINCIPAL
  // ============================================================

  /**
   * Lista general de servicios, obtenida desde el servicio central.
   * Se usa para el sidebar (otros servicios).
   *
   * @type {Service[]}
   */
  services: Service[] = this.serviceService.getAll();

  /**
   * Servicio actual mostrado en la página.
   * Se maneja como signal para reactividad interna del componente.
   *
   * @type {import('@angular/core').Signal<Service | null>}
   */
  currentService = signal<Service | null>(null);

  // ============================================================
  // BREADCRUMB DINÁMICO
  // ============================================================

  /**
   * Breadcrumb reactivo basado en el servicio actual.
   *
   * @returns {BreadcrumbItem[]} Arreglo visible en la interfaz.
   *
   * @example
   * // Ejemplo cuando el servicio existe:
   * [
   *   { label: 'Inicio', url: '/' },
   *   { label: 'Servicios', url: '/servicios' },
   *   { label: 'Ajuste de Guitarra' }
   * ]
   *
   * @usageNotes
   * - El último breadcrumb no tiene URL porque representa
   *   la página actual.
   */
  breadcrumbItems = computed<BreadcrumbItem[]>(() => {
    const current = this.currentService();

    return [
      { label: 'Inicio', url: '/' },
      { label: 'Servicios', url: '/servicios' },
      current
        ? { label: current.name }
        : { label: 'Servicio no encontrado' },
    ];
  });

  // ============================================================
  // CONSTRUCTOR → lectura de parámetros + carga del servicio
  // ============================================================

  /**
   * Subscribirse a los parámetros de la ruta permite que, si el usuario
   * navega entre servicios dentro del mismo componente (sidebar → click),
   * la vista se actualice sin recargar todo el módulo.
   *
   * @example
   * // URL:
   * /servicios/ajuste-guitarra
   *
   * // Acciones:
   * - Lee el slug
   * - Busca en el ServiceService
   * - Si no existe → redirige a /servicios
   */
  constructor() {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');

      // No existe slug → redirección inmediata
      if (!slug) {
        this.router.navigate(['/servicios']);
        return;
      }

      // Buscar servicio por slug
      const found = this.serviceService.getBySlug(slug);

      // Si no existe → volver al listado
      if (!found) {
        this.router.navigate(['/servicios']);
        return;
      }

      // Actualizar signal del servicio actual
      this.currentService.set(found);
    });
  }

  // ============================================================
  // SERVICIOS RELACIONADOS (sidebar)
  // ============================================================

  /**
   * Obtiene los servicios relacionados, excluyendo el actual.
   *
   * @returns {Service[]} Arreglo de servicios para el sidebar.
   *
   * @example
   * // currentService.id = 's1'
   * otherServices = services.filter(s => s.id !== 's1');
   *
   * @usageNotes
   * - Si currentService es null, se devuelve la lista completa.
   * - Útil para mantener consistencia de navegación entre servicios.
   */
  get otherServices(): Service[] {
    const current = this.currentService();
    if (!current) return this.services;

    return this.services.filter((s) => s.id !== current.id);
  }
}
