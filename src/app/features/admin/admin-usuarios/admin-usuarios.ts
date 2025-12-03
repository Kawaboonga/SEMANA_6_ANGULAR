
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
    UserFormComponent, // formulario para crear/editar usuarios
  ],
  templateUrl: './admin-usuarios.html',
  styleUrls: ['./admin-usuarios.css'],
})
/**
 * Panel de administración de usuarios del sistema.
 *
 * Este módulo permite gestionar:
 * - Listado total de usuarios cargados por AuthService
 * - Creación de nuevos usuarios
 * - Edición de los datos existentes (nombre, email, rol, estado)
 * - Activación/desactivación rápida
 * - Asignación de roles desde la tabla
 *
 * Usa el servicio `AuthService`, que concentra:
 * - El listado reactivo de usuarios (signal)
 * - Operaciones CRUD locales
 * - El usuario actual (para bloquear acciones si es necesario)
 *
 * @usageNotes
 * - `selectedUser = null` → modo creación.
 * - `selectedUser = User` → modo edición.
 * - El formulario se muestra como panel lateral/modal según tu HTML.
 */
export class AdminUsuarios {

  // ============================================================
  // 1) Servicios
  // ============================================================

  /** Servicio de autenticación que mantiene usuarios y roles. */
  private auth = inject(AuthService);

  // ============================================================
  // 2) State derivado desde AuthService
  // ============================================================

  /**
   * Lista reactiva de usuarios.
   * `usuarios()` se puede usar directo en el template.
   */
  usuarios = computed(() => this.auth.users());

  /**
   * Usuario actual logueado.  
   * Útil para prevenir que se auto-desactive o auto-borre.
   */
  currentUser = computed(() => this.auth.currentUser());

  // ============================================================
  // 3) State local del componente
  // ============================================================

  /** Controla si el formulario está visible. */
  showForm = false;

  /**
   * Usuario seleccionado para edición.
   * - `null` → modo crear
   * - `User` → modo editar
   */
  selectedUser: User | null = null;

  /** Lista de roles disponibles para asignar desde el panel. */
  rolesDisponibles: Array<User['role']> = ['admin', 'instructor', 'user'];

  // ============================================================
  // 4) Abrir formulario
  // ============================================================

  /**
   * Abre el formulario en modo “nuevo usuario”.
   *
   * @example
   * <button (click)="onCreate()">Nuevo usuario</button>
   */
  onCreate(): void {
    this.selectedUser = null;
    this.showForm = true;
  }

  /**
   * Abre el formulario en modo edición.
   * Se clona el usuario para evitar mutaciones en tabla.
   *
   * @param user Usuario seleccionado para editar
   */
  onEdit(user: User): void {
    this.selectedUser = { ...user };
    this.showForm = true;
  }

  // ============================================================
  // 5) Acciones rápidas en la tabla
  // ============================================================

  /**
   * Alterna la propiedad `isActive` del usuario.
   * Se usa para activar o desactivar cuentas de forma instantánea.
   *
   * @param user Usuario al que se le cambia el estado
   */
  onToggleActive(user: User): void {
    this.auth.updateUser({ ...user, isActive: !user.isActive });
  }

  /**
   * Cambia el rol del usuario desde el select de la tabla.
   *
   * @param user Usuario a modificar
   * @param role Nuevo rol asignado (admin / instructor / user)
   */
  onChangeRole(user: User, role: User['role']): void {
    this.auth.updateUser({ ...user, role });
  }

  // ============================================================
  // 6) Guardar información del formulario
  // ============================================================

  /**
   * Recibe el usuario desde `<app-user-form>` ya validado.
   * Decide entre:
   * - Crear un nuevo usuario
   * - Actualizar uno existente
   *
   * @param user Datos del formulario
   */
  handleSave(user: User): void {
    if (this.selectedUser) {
      // EDICIÓN
      this.auth.updateUser(user);
    } else {
      // CREACIÓN
      this.auth.addUser(user);
    }

    // Cierra form y resetea selección
    this.showForm = false;
    this.selectedUser = null;
  }

  /**
   * Cierra el formulario sin guardar cambios.
   */
  handleCancel(): void {
    this.showForm = false;
    this.selectedUser = null;
  }
}
