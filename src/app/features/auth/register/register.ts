
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { buildUserForm } from '@shared/forms/user-form/user-form.builder';
import { FadeUpDirective } from '@shared/directives/fade-up';
import { AuthService, RegisterPayload } from '@core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FadeUpDirective],
  templateUrl: './register.html',
})

/**
 * Componente de registro público.
 *
 * Esta pantalla permite crear un usuario nuevo sin exponer campos
 * sensibles del admin (rol o estado). Toda la lógica de validación se
 * delega al builder `buildUserForm`, que reutiliza reglas compartidas
 * con los formularios de usuario en Admin.
 *
 * El AuthService se encarga de:
 * - validar que no exista un correo repetido,
 * - crear el nuevo usuario,
 * - iniciar sesión automáticamente,
 * - persistir la sesión en localStorage.
 *
 * UX:
 * - Vista previa del nombre completo mientras el usuario escribe.
 * - Mensajes claros de error y éxito.
 * - Pequeño delay antes de redirigir para que el mensaje alcance a mostrarse.
 */
export class RegisterComponent {
  // ============================================================
  // 1) STATE DEL COMPONENTE
  // ============================================================

  /** Formulario reactivo generado por buildUserForm. */
  form: FormGroup;

  /** Flag para indicar que ya se intentó enviar el formulario. */
  submitted = false;

  /** Vista previa del nombre completo (se actualiza mientras escribe). */
  displayNamePreview = '';

  /** Mensaje de error devuelto por el AuthService (correo duplicado, etc.). */
  errorMessage = '';

  /** Mensaje de éxito cuando el registro se completa correctamente. */
  successMessage = '';

  /** Controla el estado de envío para deshabilitar botón y evitar dobles submits. */
  submitting = false;

  // ============================================================
  // 2) CONSTRUCTOR
  // ============================================================

  /**
   * Inicializa el formulario usando el builder.
   *
   * @param fb FormBuilder para construir los controles.
   * @param auth Servicio de autenticación.
   * @param router Para redirigir tras el registro.
   */
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) {
    // El builder reutiliza validaciones compartidas con UserForm.
    this.form = buildUserForm(this.fb, {
      includeRole: false,
      includeIsActive: false,
    });
  }

  // ============================================================
  // 3) HELPERS DE VALIDACIÓN
  // ============================================================

  /**
   * Indica si un control tiene un error específico y si ya debería mostrarse.
   *
   * @param controlName Nombre del campo.
   * @param errorCode Tipo de error (ej: 'required').
   */
  hasError(controlName: string, errorCode: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.touched && control.hasError(errorCode);
  }

  // ============================================================
  // 4) VISTA PREVIA DE NOMBRE COMPLETO
  // ============================================================

  /**
   * Construye una vista previa del nombre completo cuando
   * el usuario escribe en los campos firstName o lastName.
   *
   * Útil para reforzar la personalización del perfil desde el inicio.
   */
  onNameKeyup(): void {
    const first = this.form.get('firstName')?.value || '';
    const last = this.form.get('lastName')?.value || '';
    const full = `${first} ${last}`.trim();
    this.displayNamePreview = full || '';
  }

  // ============================================================
  // 5) SUBMIT DEL FORMULARIO
  // ============================================================

  /**
   * Maneja el flujo completo de registro:
   * - Valida campos
   * - Construye payload
   * - Llama a AuthService.register()
   * - Muestra mensajes según resultado
   * - Redirige tras éxito
   */
  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.submitting = true;

    // Validación previa: mostrar errores si el form es inválido
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.submitting = false;
      return;
    }

    // Payload estricto requerido por AuthService
    const { firstName, lastName, email, password } = this.form.value;

    const payload: RegisterPayload = {
      firstName: (firstName ?? '').toString(),
      lastName: (lastName ?? '').toString(),
      email: (email ?? '').toString(),
      password: (password ?? '').toString(),
    };

    // Llamada al servicio
    const result = this.auth.register(payload);

    this.submitting = false;

    // ERROR: correo duplicado u otra validación interna del servicio
    if (!result.success) {
      this.errorMessage =
        result.message ??
        'No se pudo completar el registro. Inténtalo más tarde.';
      return;
    }

    // ÉXITO
    this.successMessage =
      result.message ?? 'Registro completado con éxito. ¡Bienvenido/a!';

    // Limpieza de formulario
    this.form.reset();
    this.displayNamePreview = '';
    this.submitted = false;

    // Delay opcional para mostrar mensaje antes de redirigir
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 800);
  }

  // ============================================================
  // 6) RESET DEL FORMULARIO
  // ============================================================

  /** Indica si ya existen cambios en el formulario. */
  get canResetForm(): boolean {
    return this.form.dirty || this.form.touched;
  }

  /**
   * Limpia completamente el formulario,
   * incluyendo mensajes y vista previa.
   */
  onReset(): void {
    this.form.reset();
    this.displayNamePreview = '';
    this.submitted = false;
    this.errorMessage = '';
    this.successMessage = '';
    this.submitting = false;
  }
}
