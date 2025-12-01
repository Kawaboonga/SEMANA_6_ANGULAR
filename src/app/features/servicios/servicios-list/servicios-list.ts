import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ServiceService } from '@core/services/service.service';
import { Service } from '@core/models/service.model';

import { FadeUpDirective } from '@shared/directives/fade-up';


@Component({
  standalone: true,
  selector: 'app-servicios-list',

  // Módulos necesarios para la vista:
  // - CommonModule: *ngIf, *ngFor, estructuras comunes
  // - RouterModule: routerLink para navegar al detalle
  // - FadeUpDirective: animación de entrada
  imports: [CommonModule, RouterModule, FadeUpDirective],

  templateUrl: './servicios-list.html',
  styleUrl: './servicios-list.css'
})
export class ServiciosList {

  // ============================================================
  // 1) INYECCIÓN DEL SERVICIO
  // ============================================================

  // Usamos inject() (Angular 16+) en vez de constructor para un estilo moderno
  private serviceService = inject(ServiceService);

  // ============================================================
  // 2) LISTA DE SERVICIOS DISPONIBLES
  // ============================================================

  // El servicio retorna la data mockeada o la real según tu configuración.
  // Esto alimenta automáticamente el *ngFor del template.
  services: Service[] = this.serviceService.getAll();

  // En esta vista no hay lógica adicional, solo mostramos el listado.
}
