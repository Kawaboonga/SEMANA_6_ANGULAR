import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
/**
 * Servicio global de carga (loading indicator).
 *
 * Lleva un conteo interno de procesos activos (peticiones HTTP, fetch,
 * tareas asíncronas o cualquier operación que requiera mostrar un loader).
 *
 * Mientras exista al menos un proceso activo, `isLoading` será `true`.
 * Esto permite mostrar un spinner global, un overlay o alguna animación
 * consistente en toda la aplicación sin tener que manejar flags por separado.
 *
 * @usageNotes
 * - Llama a `show()` justo antes de iniciar un proceso.
 * - Llama a `hide()` cuando la operación finalice.
 * - El contador nunca baja de 0 gracias al `Math.max`.
 * - Ideal para usarlo junto a interceptores HTTP o eventos de navegación.
 *
 * @example
 * this.loadingService.show();
 * await apiCall();
 * this.loadingService.hide();
 */
export class LoadingService {
  /**
   * Contador interno de solicitudes activas.
   * Cada `show()` incrementa, cada `hide()` decrementa.
   * Nunca debe quedar negativo.
   */
  private _activeRequests = signal(0);

  /**
   * Estado reactivo que indica si existe algún proceso en curso.
   * `true` → hay al menos una operación activa.
   * `false` → no hay procesos pendientes.
   *
   * Se usa para mostrar el loader global en UI.
   */
  readonly isLoading = computed(() => this._activeRequests() > 0);

  /**
   * Marca el inicio de un proceso de carga.
   *
   * @example
   * this.loadingService.show();
   */
  show(): void {
    this._activeRequests.update(v => v + 1);
  }

  /**
   * Marca el término de un proceso de carga.
   * El contador nunca baja de 0 por seguridad.
   *
   * @example
   * this.loadingService.hide();
   */
  hide(): void {
    this._activeRequests.update(v => Math.max(v - 1, 0));
  }
}
