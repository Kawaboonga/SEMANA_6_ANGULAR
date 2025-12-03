// ============================================================================
// src/app/featured/servicios/servicios-list/servicios-list.ts
//
// Componente principal del listado de servicios.
// - Obtiene todos los servicios desde ServiceService.
// - Renderiza tarjetas simples con animación fade-up.
// - Usa arquitectura standalone + inject().
// ============================================================================

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ServiceService } from '@core/services/service.service';
import { Service } from '@core/models/service.model';

import { FadeUpDirective } from '@shared/directives/fade-up';

/**
 * Componente que muestra el listado completo de servicios disponibles.
 *
 * @remarks
 * - Este componente es extremadamente simple: no filtra ni transforma datos.
 * - Solo actúa como puente entre el ServiceService y la vista.
 * - La navegación al detalle se maneja con `routerLink="/servicios/:slug"`.
 *
 * @usageNotes
 * Se utiliza en la ruta:
 * ```ts
 * { path: 'servicios', loadComponent: () => import(...ServiciosList) }
 * ```
 */
@Component({
  standalone: true,
  selector: 'app-servicios-list',
  imports: [
    CommonModule,     // *ngIf, *ngFor
    RouterModule,     // routerLink
    FadeUpDirective,  // animación de entrada
  ],
  templateUrl: './servicios-list.html',
  styleUrl: './servicios-list.css'
})
export class ServiciosList {

  /**
   * Servicio central que entrega la data de servicios.
   * Se usa inject() para seguir el estándar Angular moderno.
   *
   * @private
   */
  private serviceService = inject(ServiceService);

  /**
   * Lista completa de servicios disponibles.
   * Esta colección se renderiza directamente en la vista mediante *ngFor.
   *
   * @type {Service[]}
   */
  services: Service[] = this.serviceService.getAll();

  /**
   * El componente no requiere métodos adicionales.
   * La lógica se concentra en el detalle y en el servicio.
   */
}
