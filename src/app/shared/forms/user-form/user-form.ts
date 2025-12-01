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
export class UserFormComponent implements OnInit {
  // ==========================================================================
  // INPUTS
  // ==========================================================================

  /**
   * roles:
   *   Lista de roles válidos que puede asignar el admin a un usuario.
   *   - Se usa para poblar el <select> de rol en el template.
   *   - El valor por defecto incluye los tres roles principales.
   *   Si en el futuro se agregan roles nuevos se pueden inyectar desde fuera.
   */
  @Input() roles: UserRole[] = ['admin', 'instructor', 'user'];

  /**
   * initialValue:
   *   - Si viene null → el formulario se usa para crear un usuario nuevo.
   *   - Si trae un User → el formulario se rellena con esos datos
   *     (modo edición).
   */
  @Input() initialValue: User | null = null;

  // ==========================================================================
  // OUTPUTS
  // ==========================================================================

  /**
   * cancel:
   *   Evento simple para indicar al componente padre que se canceló
   *   la operación (cerrar modal, panel, etc.).
   */
  @Output() cancel = new EventEmitter<void>();

  /**
   * save:
   *   Emite el User ya armado y normalizado cuando el formulario pasa
   *   las validaciones y se hace submit.
   */
  @Output() save = new EventEmitter<User>();

  // ==========================================================================
  // ESTADO INTERNO DEL FORM
  // ==========================================================================

  /**
   * form:
   *   FormGroup que contiene todos los campos del usuario:
   *   nombre, correo, rol, password (provisorio), dirección, etc.
   *   Se construye usando buildUserForm para mantener consistencia
   *   con otros formularios de usuario.
   */
  form: FormGroup;

  /**
   * submitted:
   *   Flag para marcar que se intentó enviar el formulario.
   *   Se puede usar en el template si se quiere diferenciar
   *   errores "antes/después" del submit.
   */
  submitted = false;

  // ==========================================================================
  // CONSTRUCTOR
  // ==========================================================================

  constructor(private fb: FormBuilder) {
    /**
     * Se crea el form usando un builder compartido:
     * - includeRole: true     → incluye el control de rol en el form.
     * - includeIsActive: true → incluye el switch/checkbox de "isActive".
     *
     * Ventaja:
     * - Si en algún momento se necesita el mismo formulario en otra parte,
     *   basta con reutilizar buildUserForm con otras opciones.
     */
    this.form = buildUserForm(this.fb, {
      includeRole: true,
      includeIsActive: true,
    });
  }

  // ==========================================================================
  // CICLO DE VIDA: Cargar valores cuando editamos
  // ==========================================================================

  /**
   * ngOnInit:
   *   Si initialValue trae un usuario, se hace patchValue para pasar
   *   el formulario directo a modo edición.
   *
   *   Nota:
   *   - Se copian campo a campo para mantener claro qué se mapea.
   *   - La password se carga también, pero está marcada como "temporal"
   *     porque en un escenario real esto debería manejarse desde el backend
   *     (nunca deberíamos manejar passwords en claro).
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
   * hasError:
   *   Helper pequeño para el HTML.
   *
   *   Uso típico:
   *     [class.is-invalid]="hasError('email','required')"
   *     *ngIf="hasError('email','email')"
   *
   *   Condición:
   *   - El control debe existir.
   *   - Debe estar "touched".
   *   - Debe tener el error con el código indicado (errorCode).
   */
  hasError(controlName: string, errorCode: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.touched && control.hasError(errorCode);
  }

  // ==========================================================================
  // GUARDAR (SUBMIT)
  // ==========================================================================

  /**
   * onSubmit:
   *   Lógica principal de guardado.
   *
   *   Flujo:
   *   1. Marca el formulario como sometido (submitted = true).
   *   2. Si el formulario es inválido:
   *        - Llama a markAllAsTouched() para que se muestren todos
   *          los errores en pantalla.
   *        - No hace nada más.
   *   3. Si es válido:
   *        - Toma form.value.
   *        - Construye un objeto User completo:
   *            • Si ya existe un id → lo reutiliza (modo edición).
   *            • Si no, genera un UUID nuevo.
   *            • Preserva createdAt si estaba definido, o lo crea nuevo.
   *            • Actualiza siempre updatedAt con el momento actual.
   *        - Emite el usuario por el EventEmitter `save`.
   *
   *   Nota importante:
   *   - El campo password está aquí solo como campo plano y marcado
   *     como "temporal". En un entorno real debería ser gestionado
   *     en el backend (hash, reset, etc.).
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

      // ⚠️ Campo sensible: solo temporal mientras no exista un backend real
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
   * onCancel:
   *   Simplemente emite el evento cancel para que el padre
   *   cierre el formulario o vuelva a la vista anterior.
   *   No modifica el form ni los datos.
   */
  onCancel(): void {
    this.cancel.emit();
  }
}
