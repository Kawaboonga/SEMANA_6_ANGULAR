import { Injectable } from '@angular/core';
import { Service } from '@core/models/service.model';
import { SERVICES_MOCK } from '@core/mocks/service.mock'; 

@Injectable({
  providedIn: 'root',
})
/**
 * Servicio encargado de manejar la información de los servicios (compra, venta,
 * intercambio, mantención, etc.).
 *
 * Por ahora funciona con un mock local (`SERVICES_MOCK`), pero está preparado
 * para conectarse a una API real en el futuro.  
 *
 * Se usa en:
 * - listado principal de servicios,
 * - cards del home,
 * - páginas de detalle tipo `/servicios/:slug`,
 * - secciones que necesitan información estática del modelo `Service`.
 *
 * @usageNotes
 * - Como los datos no cambian dinámicamente, no se usan signals aquí.
 * - Reemplazar `SERVICES_MOCK` por una llamada HTTP es directo cuando exista backend.
 *
 * @example
 * // En un componente:
 * this.services = this.serviceService.getAll();
 *
 * @example
 * // Para un detalle:
 * const servicio = this.serviceService.getBySlug('compra');
 */
export class ServiceService {
  /**
   * Lista fija de servicios que se muestran en la sección “Servicios”.
   * Mock local mientras no exista API real.
   */
  private readonly services: Service[] = SERVICES_MOCK;

  /**
   * Devuelve la lista completa de servicios.
   * Usado para:
   * - listado principal,
   * - cards del home,
   * - carrousels.
   *
   * @returns Service[] lista completa
   */
  getAll(): Service[] {
    return this.services;
  }

  /**
   * Busca un servicio puntual usando su `slug`.
   * Ideal para cargar los datos en la página de detalle:
   * `/servicios/:slug`.
   *
   * @param slug identificador del servicio en la URL
   * @returns Service encontrado o undefined si no existe
   *
   * @example
   * const s = this.serviceService.getBySlug('mantencion');
   */
  getBySlug(slug: string): Service | undefined {
    return this.services.find((s) => s.slug === slug);
  }
}
