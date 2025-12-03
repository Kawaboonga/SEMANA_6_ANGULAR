
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TutorService } from '@core/services/tutor.service';
import { Tutor } from '@core/models/tutor.model';
import { TutorFormComponent } from '@shared/forms/tutor-form/tutor-form';

@Component({
  selector: 'app-admin-tutores',
  standalone: true,
  templateUrl: './admin-tutores.html',
  imports: [CommonModule, TutorFormComponent],
})
/**
 * Panel de administración para tutores.
 *
 * Permite gestionar el ciclo completo de un tutor:
 * - Listar tutores cargados en el sistema.
 * - Crear un nuevo perfil de tutor.
 * - Editar información existente.
 * - Eliminar tutores.
 *
 * Se apoya en `TutorService`, que contiene:
 * - Toda la data del mock local.
 * - CRUD simplificado.
 * - Lógica reactiva basada en signals.
 *
 * @usageNotes
 * - `editingTutor = null` activa el modo “crear”.
 * - `editingTutor = Tutor` activa el modo “editar”.
 * - `cargarTutores()` refresca siempre la tabla central.
 */
export class AdminTutores {

  // ============================================================
  // 1) Servicios
  // ============================================================

  /** Servicio centralizado que mantiene la lista de tutores (signals + CRUD). */
  private tutorService = inject(TutorService);

  // ============================================================
  // 2) State local del componente
  // ============================================================

  /** Lista de tutores visibles en la tabla del admin. */
  tutores: Tutor[] = [];

  /** Flags básicos de interfaz. */
  loading = false;
  error = '';

  /**
   * Control de formulario:
   * - `showForm` → abre/cierra el panel.
   * - `editingTutor` → tutor cargado en el formulario (o null si es nuevo).
   */
  showForm = false;
  editingTutor: Tutor | null = null;

  /**
   * Carga inicial de tutores al instanciar el componente.
   */
  constructor() {
    this.cargarTutores();
  }

  // ============================================================
  // 3) Cargar tutores desde el servicio
  // ============================================================

  /**
   * Actualiza la lista local desde `TutorService`.
   * Maneja loading y captura errores simples.
   */
  cargarTutores(): void {
    this.loading = true;
    this.error = '';

    try {
      this.tutores = this.tutorService.getAll();
    } catch (e) {
      console.error(e);
      this.error = 'No se pudieron cargar los tutores.';
    } finally {
      this.loading = false;
    }
  }

  // ============================================================
  // 4) Crear nuevo tutor
  // ============================================================

  /**
   * Activa el formulario en modo “nuevo tutor”.
   * Limpia cualquier selección previa.
   *
   * @example
   * <button (click)="onNuevo()">Nuevo tutor</button>
   */
  onNuevo(): void {
    this.editingTutor = null;
    this.showForm = true;
  }

  // ============================================================
  // 5) Editar tutor existente
  // ============================================================

  /**
   * Abre el formulario en modo edición.
   * Se clona el objeto para no mutar la fila visible en la tabla
   * hasta que el usuario confirme los cambios.
   *
   * @param tutor Tutor seleccionado desde la tabla.
   */
  onEdit(tutor: Tutor): void {
    this.editingTutor = { ...tutor }; // evita mutaciones directas
    this.showForm = true;
  }

  // ============================================================
  // 6) Eliminar tutor
  // ============================================================

  /**
   * Confirma y elimina un tutor según su id.
   * Luego refresca la tabla.
   *
   * @param tutor Tutor a eliminar
   */
  onDelete(tutor: Tutor): void {
    if (!tutor?.id) return;

    const confirmar = confirm(`¿Eliminar tutor "${tutor.name}"?`);
    if (!confirmar) return;

    this.tutorService.deleteTutor(tutor.id);
    this.cargarTutores();
  }

  // ============================================================
  // 7) Guardar tutor (crear o actualizar)
  // ============================================================

  /**
   * Recibe el tutor validado desde el formulario.
   * Decide si crear uno nuevo o actualizar uno existente:
   *
   * - Si `editingTutor` es null → modo creación.
   * - Si `editingTutor` tiene id → modo edición (via upsertTutor).
   *
   * @param tutor Datos enviados desde el formulario.
   */
  onSaveTutor(tutor: Tutor): void {
    if (this.editingTutor) {
      // MODO EDICIÓN (actualizar existente)
      this.tutorService.upsertTutor(tutor);
    } else {
      // MODO CREACIÓN (genera id internamente)
      const { id, ...dataSinId } = tutor as any;
      this.tutorService.createTutor(dataSinId);
    }

    // Cerrar form + refrescar tabla
    this.showForm = false;
    this.editingTutor = null;
    this.cargarTutores();
  }

  // ============================================================
  // 8) Cancelar formulario
  // ============================================================

  /**
   * Cierra el formulario sin aplicar cambios.
   * Limpia cualquier tutor cargado en edición.
   *
   * @example
   * <button (click)="onCancelForm()">Cancelar</button>
   */
  onCancelForm(): void {
    this.showForm = false;
    this.editingTutor = null;
  }
}
