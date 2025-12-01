// ============================================================================
// TUTOR FILTER BAR COMPONENT
// ----------------------------------------------------------------------------
// Barra de filtros para la vista de instructores.
// Se integra con el servicio TutorService a través de la interfaz TutorFilter.
//
// Este componente es "tonto" (dumb component):
//   - No filtra nada por sí mismo.
//   - Solo emite eventos al componente padre.
//   - Mantiene una copia local para trabajar con ngModel sin mutar el @Input().
// ============================================================================

import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Interfaz compartida entre el filtro y el servicio
import { TutorFilter } from '@core/services/tutor.service';

@Component({
  selector: 'app-tutor-filter-bar',
  standalone: true,
  templateUrl: './tutor-filter-bar.html',
  imports: [CommonModule, FormsModule],
})
export class TutorFilterBarComponent implements OnChanges {

  // ==========================================================================
  // 1) ENTRADA + SALIDAS
  // ==========================================================================
  /**
   * Filtro actual recibido desde el componente padre.
   * TutorFilter está definido en el servicio para asegurar consistencia global.
   */
  @Input() filter!: TutorFilter;

  /**
   * Se emite cuando cualquier control cambia.
   * El padre actualiza el servicio, el service recalcula los tutores filtrados.
   */
  @Output() filterChange = new EventEmitter<TutorFilter>();

  /**
   * Evento independiente para el botón "Limpiar filtros".
   * Algunos componentes/servicios pueden querer reaccionar distinto al reset.
   */
  @Output() reset = new EventEmitter<void>();


  // ==========================================================================
  // 2) COPIA LOCAL DEL FILTRO
  // ==========================================================================
  /**
   * Internamente usamos una copia local del filtro para evitar
   * mutar directamente el @Input().
   * Esto permite el uso de ngModel sin side-effects.
   */
  local: TutorFilter = this.createDefaultFilter();


  // ==========================================================================
  // 3) SINCRONIZACIÓN CON @Input()
  // ==========================================================================
  /**
   * Cada vez que cambia `@Input() filter`, sincronizamos nuestra copia local.
   * Mezclamos defaults + valores entrantes para evitar undefined.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filter'] && this.filter) {
      this.local = {
        ...this.createDefaultFilter(),
        ...this.filter,
      };
    }
  }


  // ==========================================================================
  // 4) VALORES POR DEFECTO DEL FILTRO
  // ==========================================================================
  /**
   * Define el estado inicial del filtro.
   * Si en el futuro agregas más filtros, solo actualizas este método.
   */
  private createDefaultFilter(): TutorFilter {
    return {
      instrument: 'todos',
      level: 'todos',
      style: 'todos',
      modality: 'todos',
      search: '',
      minPrice: null,
      maxPrice: null,
      sortByPrice: null,
    };
  }


  // ==========================================================================
  // 5) MANEJO DE CAMBIOS DE FORMULARIO
  // ==========================================================================
  /**
   * Se ejecuta con cada ngModelChange.
   * Emite el filtro actualizado hacia el componente padre.
   */
  onChange(): void {
    this.filterChange.emit({ ...this.local });
  }


  // ==========================================================================
  // 6) RESET DEL FORMULARIO
  // ==========================================================================
  /**
   * Resetea todos los filtros a sus valores por defecto.
   *  - Actualiza this.local
   *  - Emite filterChange para aplicar inmediatamente
   *  - Emite el evento reset() por si el padre quiere reaccionar aparte
   */
  onReset(): void {
    this.local = this.createDefaultFilter();
    this.filterChange.emit({ ...this.local });
    this.reset.emit();
  }
}
