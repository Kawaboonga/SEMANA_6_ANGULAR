
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule,} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '@core/services/auth.service';
import { FadeUpDirective } from '@shared/directives/fade-up';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FadeUpDirective],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})

/**
 * Página de inicio de sesión del proyecto.
 *
 * Maneja el flujo completo de login:
 * - Validación del formulario (email + contraseña)
 * - Llamada al AuthService
 * - Manejo de mensajes de error y éxito
 * - Redirección posterior al login
 *
 * Este componente se mantiene simple y centrado en UX:
 * muestra errores según el estado del formulario,
 * bloquea el botón mientras carga y entrega feedback inmediato.
 *
 * @usageNotes
 * - El AuthService se encarga de persistir sesión en localStorage.
 * - Si quieres redirigir al admin o a "returnUrl", puedes modificar la navegación en `onSubmit`.
 */
export class LoginComponent {

  // ============================================================
  // 1) STATE DEL FORMULARIO
  // ============================================================

  /**
   * Formulario reactivo con email + password.
   * Validaciones:
   * - email: requerido + formato válido
   * - password: requerido
   */
  form: FormGroup;

  /** Flag que indica si ya se intentó enviar el formulario. */
  submitted = false;

  /** Estado de carga para deshabilitar botón y mostrar spinner. */
  loading = false;

  /** Mensaje visible en caso de error. */
  errorMessage = '';

  /** Mensaje visible en caso de login exitoso. */
  successMessage = '';

  // ============================================================
  // 2) INYECCIONES Y CONFIGURACIÓN INICIAL
  // ============================================================

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) {
    /**
     * Configuración inicial del formulario:
     * - email: string
     * - password: string
     */
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  // ============================================================
  // 3) Helper de validaciones para el HTML
  // ============================================================

  /**
   * Indica si un control del formulario tiene un error específico
   * y está en estado "touched".
   *
   * @param control Nombre del campo del formulario.
   * @param code Código de validación (ej: 'required', 'email').
   */
  hasError(control: string, code: string): boolean {
    const ctrl = this.form.get(control);
    return !!ctrl && ctrl.touched && ctrl.hasError(code);
  }

  // ============================================================
  // 4) SUBMIT DEL FORMULARIO DE LOGIN
  // ============================================================

  /**
   * Maneja el submit del login:
   * - Marca el formulario como enviado
   * - Valida campos
   * - Llama a AuthService.login
   * - Muestra mensajes de error o éxito
   * - Redirige al área privada si todo sale bien
   *
   * @example
   * <button (click)="onSubmit()">Ingresar</button>
   */
  onSubmit(): void {
    this.submitted = true;

    // Reset de mensajes previos
    this.errorMessage = '';
    this.successMessage = '';

    // Validación previa: si está malo, mostrar errores y detener
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const { email, password } = this.form.value;

    // Llamada al servicio de autenticación
    const result = this.auth.login({
      email: (email ?? '').toString(),
      password: (password ?? '').toString(),
    });

    // Error en login (credenciales o usuario inactivo)
    if (!result.success) {
      this.errorMessage =
        result.message ??
        'Ocurrió un error al iniciar sesión. Intenta nuevamente.';
      this.loading = false;
      return;
    }

    // Login exitoso
    this.successMessage = 'Inicio de sesión exitoso. Redirigiendo...';

    // Delay para mostrar el mensaje antes de navegar
    setTimeout(() => {
      this.form.reset();
      this.submitted = false;
      this.loading = false;

      // Redirección por defecto
      this.router.navigate(['/mi-cuenta']);
    }, 800);
  }
}
