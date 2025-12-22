import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TutorService, TutorFilter } from '@core/services/tutor.service';
import { AuthService } from '@core/services/auth.service';
import { Tutor } from '@core/models/tutor.model';

import { TutorCardComponent } from '@shared/components/tutor-card/tutor-card';
import { TutorFilterBarComponent } from '@shared/components/tutor-filter-bar/tutor-filter-bar';
import { TutorFormComponent } from '@shared/forms/tutor-form/tutor-form';
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
 * Además, tal como en Productos/Cursos, el Admin puede:
 * - Crear un nuevo tutor
 * - Editar un tutor existente
 * - Eliminar un tutor
 *
 * Todo esto reutilizando `TutorFormComponent` y persistiendo con `TutorService`.
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
    TutorFormComponent,
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

  /** Servicio de autenticación para saber si el usuario actual es admin. */
  private authService = inject(AuthService);

  // ---------------------------------------------------------------------------
  // ADMIN: ¿ES ADMINISTRADOR?
  // ---------------------------------------------------------------------------

  /** True si el usuario logueado tiene rol admin. */
  isAdmin = computed(() => this.authService.isAdmin());

  // ---------------------------------------------------------------------------
  // ADMIN: FORM STATE (CREAR / EDITAR)
  // ---------------------------------------------------------------------------

  /** Controla si se muestra el formulario inline (crear/editar). */
  showForm = signal(false);

  /** Tutor seleccionado para editar (null en modo crear). */
  selectedTutor = signal<Tutor | null>(null);

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

  // ---------------------------------------------------------------------------
  // ADMIN: CRUD DESDE LA VISTA PÚBLICA (CARDS)
  // ---------------------------------------------------------------------------

  /** Abre el formulario en modo "crear". */
  onAdminCreate(): void {
    if (!this.isAdmin()) return;

    this.selectedTutor.set(null);
    this.showForm.set(true);
  }

  /** Abre el formulario en modo "editar" buscando el tutor por id. */
  onAdminEdit(tutorId: string): void {
    if (!this.isAdmin()) return;

    const found = this.service.getTutorById(tutorId) ?? null;

    // Clonamos para evitar mutar referencias compartidas.
    this.selectedTutor.set(found ? { ...found } : null);
    this.showForm.set(true);
  }

  /** Elimina el tutor (la confirmación ocurre en la card, igual que productos/cursos). */
  onAdminDelete(tutorId: string): void {
    if (!this.isAdmin()) return;
    this.service.deleteTutor(tutorId);
  }

  /** Guarda (create o upsert) el tutor emitido desde TutorFormComponent. */
  onAdminSave(tutor: Tutor): void {
    if (!this.isAdmin()) return;

    // Si no existe, lo agregamos (simula POST). Si existe, actualiza (PUT).
    const exists = this.service.getAll().some((t) => t.id === tutor.id);

    if (exists) this.service.upsertTutor(tutor);
    else this.service.createTutor({ ...(tutor as any), id: undefined } as any);

    this.showForm.set(false);
    this.selectedTutor.set(null);
  }

  /** Cancela el formulario (crear/editar) y limpia el estado. */
  onAdminCancel(): void {
    this.showForm.set(false);
    this.selectedTutor.set(null);
  }
}
