
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

import { TutorFilter } from '@core/services/tutor.service';

/**
 * ============================================================================
 * TutorFilterBarComponent
 * ============================================================================
 *
 * @description
 * Componente de barra de filtros reutilizable para la sección de tutores.
 * Expone inputs y outputs simples, permitiendo que el componente padre tome
 * control total del filtrado real mediante TutorService.
 *
 * @usageNotes
 * - No aplica filtros directamente: solo emite eventos.
 * - Siempre mantiene una copia local (`local`) para trabajar con ngModel
 *   sin mutar el @Input().
 * - Cuando cambia el @Input() `filter`, se sincroniza automáticamente.
 *
 * @example
 * <app-tutor-filter-bar
 *    [filter]="filter()"
 *    (filterChange)="onFilterChange($event)"
 *    (reset)="onResetFilters()"
 * ></app-tutor-filter-bar>
 */
@Component({
  selector: 'app-tutor-filter-bar',
  standalone: true,
  templateUrl: './tutor-filter-bar.html',
  imports: [CommonModule, FormsModule],
})
export class TutorFilterBarComponent implements OnChanges {

  // ==========================================================================
  // 1) ENTRADAS Y SALIDAS
  // ==========================================================================

  /**
   * Filtro actual proveniente del componente padre.
   *
   * @type {TutorFilter}
   * @input
   */
  @Input() filter!: TutorFilter;

  /**
   * Evento emitido cada vez que cambia cualquier valor del formulario local.
   * El componente padre recibirá el nuevo filtro y actualizará TutorService.
   *
   * @type {EventEmitter<TutorFilter>}
   * @output
   */
  @Output() filterChange = new EventEmitter<TutorFilter>();

  /**
   * Evento separado que se dispara al presionar "Limpiar filtros".
   * Útil cuando el padre también necesita ejecutar lógica adicional.
   *
   * @type {EventEmitter<void>}
   * @output
   */
  @Output() reset = new EventEmitter<void>();


  // ==========================================================================
  // 2) ESTADO LOCAL
  // ==========================================================================

  /**
   * Copia local del filtro, usada para binding con ngModel.
   * Evita mutaciones accidentales del @Input() original.
   *
   * @type {TutorFilter}
   */
  local: TutorFilter = this.createDefaultFilter();


  // ==========================================================================
  // 3) SINCRONIZACIÓN CON INPUT
  // ==========================================================================

  /**
   * Lifecycle hook que detecta cambios en los @Input().
   * Mezcla defaults + valores entrantes para reconstruir `local`.
   *
   * @param {SimpleChanges} changes
   * @returns {void}
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
  // 4) VALORES INICIALES DEL FILTRO
  // ==========================================================================

  /**
   * Genera un filtro limpio con todos los valores por defecto.
   *
   * @returns {TutorFilter}
   * @example
   * const f = this.createDefaultFilter();
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
  // 5) MANEJO DE CAMBIOS EN LOS SELECT / INPUTS
  // ==========================================================================

  /**
   * Emite un evento cada vez que un control del formulario cambia.
   * El padre recibe `{...local}` y actualiza el TutorService.
   *
   * @returns {void}
   */
  onChange(): void {
    this.filterChange.emit({ ...this.local });
  }


  // ==========================================================================
  // 6) RESETEAR FILTROS
  // ==========================================================================

  /**
   * Reset completo del formulario de filtros.
   *
   * @returns {void}
   * @usageNotes
   * - Restaura valores por defecto.
   * - Emite filterChange() inmediatamente para aplicar el filtro limpio.
   * - Emite reset() por si el padre desea lógica propia adicional.
   *
   * @example
   * this.onReset();
   */
  onReset(): void {
    this.local = this.createDefaultFilter();
    this.filterChange.emit({ ...this.local });
    this.reset.emit();
  }
}
