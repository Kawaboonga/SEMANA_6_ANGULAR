

// ===========================================================================
// LOADING COMPONENT (Standalone)
// ---------------------------------------------------------------------------
// Este componente escucha el estado global de carga expuesto por LoadingService.
// Se renderiza únicamente cuando isLoading === true.
//
// Se utiliza para overlays de carga, spinners globales o transiciones entre páginas.
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
  // -------------------------------------------------------------------------
  // INYECCIÓN DE SERVICIO
  // -------------------------------------------------------------------------
  // LoadingService expone:
  //   • isLoading(): boolean — estado actual
  //   • setLoading(true/false) — para activar/desactivar
  //
  // Aquí lo consumimos para reaccionar de forma reactiva.
  private loadingService = inject(LoadingService);

  // -------------------------------------------------------------------------
  // PROP: isLoading (computed)
  // -------------------------------------------------------------------------
  // Se usa computed() para recalcular automáticamente cuando cambia el estado
  // del servicio. Esto permite renderizar el componente sin suscripciones manuales.
  //
  // Ideal para un overlay global que aparece/desaparece instantáneamente.
  // -------------------------------------------------------------------------
  isLoading = computed(() => this.loadingService.isLoading());
}
