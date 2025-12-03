// ===========================================================================
// LOADING COMPONENT (Standalone)
// ---------------------------------------------------------------------------
// Componente visual global encargado de mostrar un overlay o spinner de carga.
// 
// Funciona escuchando el estado reactivo expuesto por LoadingService:
//   - isLoading(): boolean (signal readonly)
// 
// Este componente es completamente "tonto" (presentacional). No administra
// solicitudes ni lógica de carga; simplemente observa el servicio.
//
// Uso típico:
//   <app-loading></app-loading>
// 
// Se recomienda incluirlo en app.component.html para que siempre esté disponible.
// ===========================================================================

import { Component, computed, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { LoadingService } from '@core/services/loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [NgIf],
  templateUrl: './loading.html',
  styleUrls: ['./loading.css'],
})
export class LoadingComponent {

  // ---------------------------------------------------------------------------
  // INYECCIÓN DE SERVICIO
  // ---------------------------------------------------------------------------

  /**
   * @description
   * Servicio global encargado de manejar el estado de carga de la aplicación.
   * Expone un signal `isLoading` que indica si existen procesos pendientes.
   */
  private loadingService = inject(LoadingService);


  // ---------------------------------------------------------------------------
  // COMPUTED: isLoading
  // ---------------------------------------------------------------------------

  /**
   * @description
   * Estado reactivo que indica si debe mostrarse el overlay de carga.
   * 
   * Este computed se recalcula automáticamente cuando el LoadingService
   * incrementa o decrementa su contador interno.
   * 
   * @return boolean — `true` cuando la aplicación está en estado de carga.
   * 
   * @example
   * <!-- loading.html -->
   * <div class="loading-backdrop" *ngIf="isLoading()">
   *    <div class="loader"></div>
   * </div>
   * 
   * @usageNotes
   * - No requiere suscripciones manuales ni ngOnDestroy.
   * - Funciona con cualquier llamada que haga `loadingService.show()` / `hide()`.
   * - Ideal para cubrir toda la ventana con un overlay mientras se cargan datos.
   */
  isLoading = computed(() => this.loadingService.isLoading());
}
