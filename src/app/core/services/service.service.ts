import { Injectable } from '@angular/core';
import { Service } from '@core/models/service.model';
import { SERVICES_MOCK } from '@core/mocks/service.mock'; 

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  // Lista fija de servicios que se muestran en la sección "Servicios".
  // Por ahora todo es mock local: más adelante se puede mover a un JSON o a una API.
 

  private readonly services: Service[] = SERVICES_MOCK;


  // Devuelve la lista completa de servicios.
  // Se usa para el listado principal o para carruseles.
  getAll(): Service[] {
    return this.services;
  }

  // Busca un servicio puntual por su slug.
  // Ideal para las páginas de detalle tipo /servicios/:slug.
  getBySlug(slug: string): Service | undefined {
    return this.services.find((s) => s.slug === slug);
  }
}
