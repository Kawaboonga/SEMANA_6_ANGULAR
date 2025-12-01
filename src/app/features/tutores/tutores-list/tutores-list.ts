// ============================================================================
//  LISTA DE TUTORES
//  ---------------------------------------------------------------------------
//  Este componente:
//    • Muestra el listado de tutores usando <app-tutor-card>
//    • Controla los filtros de búsqueda (instrumentos, estilos, modalidad, comuna…)
//    • Consume la lógica de filtrado del TutorService (smart component)
//    • Usa tutor-filter-bar como componente “tonto” que solo emite eventos
// ============================================================================

import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { TutorService, TutorFilter } from '@core/services/tutor.service';
import { TutorCardComponent } from '@shared/components/tutor-card/tutor-card';
import { TutorFilterBarComponent } from '@shared/components/tutor-filter-bar/tutor-filter-bar';
import { FadeUpDirective } from '@shared/directives/fade-up';


@Component({
  selector: 'app-tutores-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TutorCardComponent,        // Tarjeta visual de tutor (dumb component)
    TutorFilterBarComponent,   // Barra de filtros (dumb component)
    FadeUpDirective,
  ],
  templateUrl: './tutores-list.html',
})
export class TutoresListComponent {

  // ==========================================================================
  //  INYECCIÓN DEL SERVICIO PRINCIPAL
  // --------------------------------------------------------------------------
  //  TutorService contiene:
  //    • lista completa de tutores
  //    • filtro actual
  //    • lógica de filtrado
  // ==========================================================================
  private service = inject(TutorService);

  // ==========================================================================
  //  FILTER (signal readonly)
  //  -------------------------------------------------------------------------
  //  Expone el estado del filtro actual. Se usa para mostrar valores actuales
  //  dentro de la barra de filtros (componentes tontos).
  // ==========================================================================
  filter = this.service.filter;

  // ==========================================================================
  //  TUTORES FILTRADOS
  //  -------------------------------------------------------------------------
  //  `filteredTutors()` viene del servicio y aplica:
  //    • instrumento
  //    • estilo
  //    • nivel
  //    • modalidad
  //    • comuna
  //    • texto de búsqueda
  //
  //  computed() → se recalcula en automático si cambia el filtro
  // ==========================================================================
  tutors = computed(() => this.service.filteredTutors());

  // ==========================================================================
  //  ACTUALIZACIÓN DE FILTROS
  //  -------------------------------------------------------------------------
  //  El componente de filtros emite un objeto parcial:
  //    { instrument?: string, style?: string, ... }
  //  Aquí se pasa al servicio, que actualiza el signal del filtro.
  // ==========================================================================
  onFilterChange(partial: Partial<TutorFilter>) {
    this.service.setFilter(partial);
  }

  // ==========================================================================
  //  RESETEO GENERAL DE FILTROS
  //  -------------------------------------------------------------------------
  //  Resetea todos los filtros del servicio a sus valores iniciales.
  // ==========================================================================
  onResetFilters() {
    this.service.resetFilter();
  }

  // ==========================================================================
  //  ALIAS PARA EL TEMPLATE
  //  -------------------------------------------------------------------------
  //  Algunas plantillas esperan el método “onResetFilter” (sin 's').
  //  Creamos una compatibilidad suave para no romper nada.
  // ==========================================================================
  onResetFilter(): void {
    if (typeof (this as any).onResetFilters === 'function') {
      (this as any).onResetFilters();
    }
  }
}
