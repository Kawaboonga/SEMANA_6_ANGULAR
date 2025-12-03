// src/app/shared/forms/user-form/user-form.ts

// ============================================================================
// USER FORM COMPONENT
// ----------------------------------------------------------------------------
// Formulario de administración para crear / editar usuarios del sistema.
//
// Idea general:
// - Usa un FormGroup construido a partir de un builder reutilizable
//   (buildUserForm), así no repito la definición del formulario en todos
//   los lugares donde gestione usuarios.
// - Soporta dos modos:
//    • Crear: initialValue = null → se genera un usuario nuevo con id y fechas.
//    • Editar: initialValue con datos → se cargan los valores existentes.
// - El componente no sabe nada de persistencia: solo arma un objeto User
//   coherente y se lo entrega al padre vía el EventEmitter `save`.
// - Los errores de validación se controlan desde el HTML con el helper hasError().
// ============================================================================

import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { buildUserForm } from './user-form.builder';
import { User, UserRole } from '@core/models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.html',
})

/**
 * @description
 * Formulario de administración para crear y editar usuarios (`User`).
 *
 * Responsabilidades:
 * - Construir un `FormGroup` consistente usando `buildUserForm`.
 * - Soportar modo creación (`initialValue = null`) y modo edición (`initialValue` con datos).
 * - Emitir un `User` completo y normalizado al componente padre cuando el form es válido.
 *
 * @usageNotes
 * ```html
 * <app-user-form
 *   [roles]="['admin','instructor','user']"
 *   [initialValue]="usuarioSeleccionado"
 *   (save)="onSaveUser($event)"
 *   (cancel)="onCancelUser()">
 * </app-user-form>
 * ```
 */
export class UserFormComponent implements OnInit {
  // ==========================================================================
  // INPUTS
  // ==========================================================================

  /**
   * @description
   * Lista de roles válidos que puede asignar el admin a un usuario.
   * Se usa para poblar el `<select>` de rol en el template.
   *
   * @usageNotes
   * Puedes inyectar una lista distinta de roles desde el padre:
   * ```html
   * <app-user-form [roles]="['admin','user']"></app-user-form>
   * ```
   */
  @Input() roles: UserRole[] = ['admin', 'instructor', 'user'];

  /**
   * @description
   * Valor inicial del formulario.
   *
   * - `null` → modo creación (usuario nuevo).
   * - `User` → modo edición (el formulario se rellena con esos datos).
   *
   * @usageNotes
   * Útil para reutilizar el mismo componente en "crear" y "editar".
   */
  @Input() initialValue: User | null = null;

  // ==========================================================================
  // OUTPUTS
  // ==========================================================================

  /**
   * @description
   * Evento simple para indicar al componente padre que se canceló
   * la operación (cerrar modal, panel lateral, etc.).
   *
   * @example
   * ```ts
   * onCancelUser() {
   *   this.showForm = false;
   * }
   * ```
   */

  @Output() cancel = new EventEmitter<void>();

  /**
   * @description
   * Emite el `User` ya armado y normalizado cuando el formulario
   * pasa las validaciones y se hace submit.
   *
   * @example
   * ```ts
   * onSaveUser(user: User) {
   *   this.userService.upsert(user);
   * }
   * ```
   */
  @Output() save = new EventEmitter<User>();

  // ==========================================================================
  // ESTADO INTERNO DEL FORM
  // ==========================================================================

  /**
   * @description
   * `FormGroup` que contiene todos los campos del usuario:
   * nombre, correo, rol, password (provisoria), dirección, etc.
   *
   * Se construye usando `buildUserForm` para mantener consistencia
   * con otros formularios de usuario.
   */
  form: FormGroup;

  /**
   * @description
   * Flag para marcar que se intentó enviar el formulario.
   * Se puede usar en el template para diferenciar errores
   * antes y después del submit.
   */
  submitted = false;

  // ==========================================================================
  // CONSTRUCTOR
  // ==========================================================================

  /**
   * @description
   * Constructor del componente. Crea el formulario base usando
   * el builder compartido `buildUserForm`.
   *
   * @param fb Servicio `FormBuilder` de Angular para formularios reactivos.
   *
   * @usageNotes
   * El builder recibe opciones:
   * - `includeRole: true`     → incluye el control de rol.
   * - `includeIsActive: true` → incluye el control `isActive`.
   */
  constructor(private fb: FormBuilder) {
    this.form = buildUserForm(this.fb, {
      includeRole: true,
      includeIsActive: true,
    });
  }

  // ==========================================================================
  // CICLO DE VIDA: Cargar valores cuando editamos
  // ==========================================================================

  /**
   * @description
   * Hook de inicialización del componente.
   *
   * Si `initialValue` trae un usuario:
   * - Se hace `patchValue` para pasar el formulario directo a modo edición.
   * - Se copian los campos uno a uno para mantener claro el mapeo.
   *
   * @usageNotes
   * El campo `password` se carga también, pero está marcado como temporal:
   * en un escenario real las passwords deberían manejarse siempre en el backend.
   */
  ngOnInit(): void {
    if (this.initialValue) {
      this.form.patchValue({
        firstName: this.initialValue.firstName,
        lastName: this.initialValue.lastName,
        email: this.initialValue.email,
        role: this.initialValue.role,
        password: this.initialValue.password, // ⚠️ temporal (hasta usar backend real)
        dateOfBirth: this.initialValue.dateOfBirth,
        shippingAddress: this.initialValue.shippingAddress,
        isActive: this.initialValue.isActive,
      });
    }
  }

  // ==========================================================================
  // HELPER DE VALIDACIÓN PARA EL TEMPLATE
  // ==========================================================================

  /**
   * @description
   * Helper pequeño de validación para el template.
   *
   * Devuelve `true` si:
   * - El control existe.
   * - Fue tocado (`touched`).
   * - Tiene el error con el código indicado (`errorCode`).
   *
   * @param controlName Nombre del control dentro del formulario (ej: `"email"`).
   * @param errorCode Código de error (ej: `"required"`, `"email"`).
   * @returns `true` si el control cumple las condiciones anteriores.
   *
   * @example
   * ```html
   * <input
   *   type="email"
   *   class="form-control"
   *   formControlName="email"
   *   [class.is-invalid]="hasError('email','required') || hasError('email','email')"
   * />
   * <div class="invalid-feedback" *ngIf="hasError('email','required')">
   *   El correo es obligatorio.
   * </div>
   * ```
   */
  hasError(controlName: string, errorCode: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.touched && control.hasError(errorCode);
  }

  // ==========================================================================
  // GUARDAR (SUBMIT)
  // ==========================================================================

  /**
   * @description
   * Maneja el envío del formulario de usuario.
   *
   * Flujo:
   * 1. Marca el formulario como sometido (`submitted = true`).
   * 2. Si el formulario es inválido:
   *    - Llama a `markAllAsTouched()` para mostrar todos los errores.
   *    - No emite nada.
   * 3. Si es válido:
   *    - Toma `form.value`.
   *    - Construye un objeto `User` completo:
   *        • Si ya existe un `id` → lo reutiliza (modo edición).
   *        • Si no, genera un `crypto.randomUUID()` (modo creación).
   *        • Preserva `createdAt` si estaba definido o lo inicializa ahora.
   *        • Siempre actualiza `updatedAt` con la fecha/hora actual.
   *    - Emite el usuario mediante el `EventEmitter` `save`.
   *
   * @usageNotes
   * El campo `password` en este componente se trata como texto plano
   * solo de manera temporal. En un sistema real, la contraseña debería
   * ser enviada a un backend que la procese (hash, reset, etc.).
   */
  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;

    const user: User = {
      // Si estoy editando, mantengo el id original.
      // Si es un usuario nuevo, genero uno con crypto.randomUUID().
      id: this.initialValue?.id ?? crypto.randomUUID(),

      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      role: formValue.role,
      dateOfBirth: formValue.dateOfBirth,

      // Campo sensible: solo temporal mientras no exista un backend real
      // que maneje la password de forma segura.
      password: formValue.password,

      shippingAddress: formValue.shippingAddress,
      isActive: formValue.isActive,

      // createdAt:
      //   - Se conserva el original si viene un usuario en edición.
      //   - Si es nuevo, se crea con la fecha actual.
      createdAt: this.initialValue?.createdAt ?? new Date().toISOString(),

      // updatedAt:
      //   - Siempre se pisa con la fecha/hora actual.
      updatedAt: new Date().toISOString(),
    };

    this.save.emit(user);
  }

  // ==========================================================================
  // CANCELAR
  // ==========================================================================

  /**
   * @description
   * Notifica al componente padre que se canceló la operación.
   *
   * No modifica el formulario ni los datos; solo emite el evento `cancel`,
   * para que el padre cierre el formulario o navegue a otra vista.
   *
   * @example
   * ```ts
   * onCancelUserForm(): void {
   *   this.showUserForm = false;
   * }
   * ```
   */
  onCancel(): void {
    this.cancel.emit();
  }
}
