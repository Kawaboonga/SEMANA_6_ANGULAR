// src/app/features/admin/admin-usuarios/admin-usuarios.ts

import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '@core/services/auth.service';
import { User } from '@core/models/user.model';
import { UserFormComponent } from '@shared/forms/user-form/user-form';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UserFormComponent, // componente de formulario de usuario (crear / editar)
  ],
  templateUrl: './admin-usuarios.html',
  styleUrls: ['./admin-usuarios.css'],
})
export class AdminUsuarios {
  // ============================================================
  // 1) Servicios
  // ============================================================
  // Servicio de autenticación:
  // - mantiene el listado de usuarios
  // - expone el usuario actual
  // - entrega métodos para actualizar/crear usuarios
  private auth = inject(AuthService);

  // ============================================================
  // 2) State derivado desde AuthService
  // ============================================================
  // Lista reactiva de usuarios (viene del signal del AuthService).
  // Se usa en el template como usuarios().
  usuarios = computed(() => this.auth.users());

  // Usuario actual logueado (para mostrar info o bloquear acciones).
  currentUser = computed(() => this.auth.currentUser());

  // ============================================================
  // 3) State local del componente
  // ============================================================
  // Controla si el formulario de usuario está visible o no.
  showForm = false;

  // Usuario seleccionado para edición.
  // null → modo "nuevo usuario".
  selectedUser: User | null = null;

  // Listado de roles disponibles para asignar en el panel.
  rolesDisponibles: Array<User['role']> = ['admin', 'instructor', 'user'];

  // ============================================================
  // 4) Acciones para abrir formulario
  // ============================================================

  // Abrir formulario en modo creación.
  onCreate(): void {
    this.selectedUser = null;
    this.showForm = true;
  }

  // Abrir formulario en modo edición con copia del usuario.
  onEdit(user: User): void {
    this.selectedUser = { ...user };
    this.showForm = true;
  }

  // ============================================================
  // 5) Acciones rápidas desde la tabla
  // ============================================================

  // Activar / desactivar usuario (toggle de isActive).
  onToggleActive(user: User): void {
    this.auth.updateUser({ ...user, isActive: !user.isActive });
  }

  // Cambiar el rol del usuario desde el select de la tabla.
  onChangeRole(user: User, role: User['role']): void {
    this.auth.updateUser({ ...user, role });
  }

  // ============================================================
  // 6) Guardar datos del formulario
  // ============================================================

  // Recibe el usuario desde <app-user-form> ya validado.
  // Decide si actualiza un usuario existente o crea uno nuevo.
  handleSave(user: User): void {
    if (this.selectedUser) {
      // Modo edición: se actualiza el usuario existente.
      this.auth.updateUser(user);
    } else {
      // Modo creación: se agrega un nuevo usuario.
      this.auth.addUser(user);
    }

    // Cerrar formulario y limpiar estado local.
    this.showForm = false;
    this.selectedUser = null;
  }

  // Cancelar el formulario sin guardar cambios.
  handleCancel(): void {
    this.showForm = false;
    this.selectedUser = null;
  }
}
