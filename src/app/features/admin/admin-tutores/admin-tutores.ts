// src/app/features/admin/admin-tutores/admin-tutores.ts

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
export class AdminTutores {
  // ============================================================
  // 1) Servicios
  // ============================================================
  // Servicio centralizado de tutores (mock local con signals + CRUD).
  private tutorService = inject(TutorService);

  // ============================================================
  // 2) State local del componente
  // ============================================================
  // Lista que se muestra en la tabla del admin.
  tutores: Tutor[] = [];

  // Flags simples para manejar estado de carga y errores.
  loading = false;
  error = '';

  // Control del formulario (modal/panel):
  // - showForm: abre/cierra el formulario
  // - editingTutor: tutor actual en edición (null → modo "nuevo")
  showForm = false;
  editingTutor: Tutor | null = null;

  // Al crear el componente, se cargan los tutores existentes.
  constructor() {
    this.cargarTutores();
  }

  // ============================================================
  // 3) Cargar tutores desde el servicio
  // ============================================================
  // Método centralizado para actualizar la lista desde el TutorService.
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
  // Abre el formulario en modo "nuevo" (sin tutor seleccionado).
  onNuevo(): void {
    this.editingTutor = null;
    this.showForm = true;
  }

  // ============================================================
  // 5) Editar tutor existente
  // ============================================================
  // Recibe el tutor de la tabla, lo clona y lo pasa al formulario.
  onEdit(tutor: Tutor): void {
    // Se clona el objeto para evitar mutar directamente la referencia
    // que muestra la tabla mientras el usuario edita el formulario.
    this.editingTutor = { ...tutor };
    this.showForm = true;
  }

  // ============================================================
  // 6) Eliminar tutor
  // ============================================================
  // Confirma y elimina el tutor desde el servicio, luego recarga lista.
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
  // Recibe el tutor desde el formulario ya validado.
  // Decide si crea uno nuevo o actualiza el existente.
  onSaveTutor(tutor: Tutor): void {
    if (this.editingTutor) {
      // MODO EDICIÓN:
      // upsertTutor actualiza si existe por id, o lo agrega si no está.
      this.tutorService.upsertTutor(tutor);
    } else {
      // MODO CREACIÓN:
      // createTutor genera un id nuevo internamente (crypto.randomUUID).
      const { id, ...dataSinId } = tutor as any;
      this.tutorService.createTutor(dataSinId);
    }

    // Cerrar formulario y limpiar selección
    this.showForm = false;
    this.editingTutor = null;

    // Refrescar la tabla para reflejar los cambios
    this.cargarTutores();
  }

  // ============================================================
  // 8) Cancelar formulario
  // ============================================================
  // Cierra el formulario sin aplicar cambios.
  onCancelForm(): void {
    this.showForm = false;
    this.editingTutor = null;
  }
}
