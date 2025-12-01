
import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  // Lleva el conteo de solicitudes activas (fetch, http, procesos de carga).
  // Cada vez que empieza algo → incremento; cuando termina → decremento.
  private _activeRequests = signal(0);

  // Expone un booleano reactivo para la UI.
  // isLoading será true cuando haya al menos 1 solicitud activa.
  // Se usa para mostrar un spinner global o un loader de página.
  readonly isLoading = computed(() => this._activeRequests() > 0);

  // Marca el inicio de un proceso.
  // Ej: antes de un http.get().
  show(): void {
    this._activeRequests.update(v => v + 1);
  }

  // Marca el fin de un proceso.
  // Aseguro que nunca baje de 0, por seguridad.
  hide(): void {
    this._activeRequests.update(v => Math.max(v - 1, 0));
  }
}


