
import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { TutorService, TutorFilter } from '@core/services/tutor.service';
import { TutorCardComponent } from '@shared/components/tutor-card/tutor-card';
import { TutorFilterBarComponent } from '@shared/components/tutor-filter-bar/tutor-filter-bar';
import { FadeUpDirective } from '@shared/directives/fade-up';

/**
 * ============================================================================
 * Componente: TutoresListComponent
 * ============================================================================
 *
 * @description
 * Vista principal del listado de tutores.  
 * Funciona como **smart component**, concentrando:
 * - Estado global del filtro (expuesto por TutorService)
 * - Lista reactiva de tutores ya filtrados
 * - Eventos provenientes de la barra de filtros
 *
 * La presentación (tarjetas, UI y animaciones) se delega a componentes tontos.
 *
 * @usageNotes
 * - El filtrado real ocurre en TutorService mediante signals + computed.
 * - Este componente solo coordina entradas y salidas.
 * - TutorFilterBarComponent nunca debería hacer lógica pesada.
 *
 * @example
 * <app-tutores-list></app-tutores-list>
 */
@Component({
  selector: 'app-tutores-list',
  standalone: true,
  imports: [
    CommonModule,
    TutorCardComponent,
    TutorFilterBarComponent,
    FadeUpDirective,
  ],
  templateUrl: './tutores-list.html',
})
export class TutoresListComponent {

  // ---------------------------------------------------------------------------
  // INYECCIÓN DEL SERVICIO PRINCIPAL
  // ---------------------------------------------------------------------------
  /**
   * @description
   * TutorService mantiene:
   * - Lista completa de tutores
   * - Estado del filtro actual
   * - Lógica de filtrado centralizada
   */
  private service = inject(TutorService);

  // ---------------------------------------------------------------------------
  // FILTRO ACTUAL (readonly)
  // ---------------------------------------------------------------------------
  /**
   * @description
   * Signal readonly con el estado actual del filtro.
   * Se usa para mostrar valores actuales en la barra de filtros.
   */
  filter = this.service.filter;

  // ---------------------------------------------------------------------------
  // LISTA DE TUTORES FILTRADOS
  // ---------------------------------------------------------------------------
  /**
   * @description
   * Lista final de tutores ya filtrados según:
   * - instrumento
   * - nivel
   * - estilo
   * - modalidad
   * - rango de precio
   * - texto de búsqueda
   *
   * @returns Tutor[]
   * @example
   * <app-tutor-card *ngFor="let t of tutors()" [tutor]="t"></app-tutor-card>
   */
  tutors = computed(() => this.service.filteredTutors());

  // ---------------------------------------------------------------------------
  // EVENTO: CAMBIO DE FILTROS
  // ---------------------------------------------------------------------------
  /**
   * @description
   * Recibe un objeto parcial con cambios del filtro emitido por
   * <app-tutor-filter-bar>. El servicio actualiza el signal del filtro.
   *
   * @param {Partial<TutorFilter>} partial - Campos del filtro a sobrescribir.
   *
   * @example
   * onFilterChange({ instrument: 'guitarra' });
   */
  onFilterChange(partial: Partial<TutorFilter>) {
    this.service.setFilter(partial);
  }

  // ---------------------------------------------------------------------------
  // EVENTO: RESET GENERAL DE FILTROS
  // ---------------------------------------------------------------------------
  /**
   * @description
   * Restaura todos los filtros a sus valores por defecto:
   * - instrument: 'todos'
   * - level: 'todos'
   * - style: 'todos'
   * - modality: 'todos'
   * - búsqueda vacía
   * - sin rangos de precio
   *
   * @usageNotes
   * Esto actualiza la UI y el listado automáticamente gracias a signals.
   */
  onResetFilters() {
    this.service.resetFilter();
  }

  // ---------------------------------------------------------------------------
  // ALIAS PARA COMPATIBILIDAD
  // ---------------------------------------------------------------------------
  /**
   * @description
   * Alias suave para plantillas antiguas que esperan el nombre
   * `onResetFilter()` (singular). Internamente reusa el nuevo método plural.
   */
  onResetFilter(): void {
    if (typeof (this as any).onResetFilters === 'function') {
      (this as any).onResetFilters();
    }
  }
}
