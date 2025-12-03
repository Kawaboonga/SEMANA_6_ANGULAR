
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators,} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { FadeUpDirective } from '@shared/directives/fade-up';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FadeUpDirective],
  templateUrl: './recover.html',
  styleUrls: ['./recover.css'],
})

/**
 * Página de recuperación de contraseña.
 *
 * Flujo simple que simula el envío de instrucciones al correo del usuario.
 * Este componente no realiza cambios reales porque el proyecto aún no
 * cuenta con backend; en cambio, AuthService entrega un mensaje consistente
 * y orientado a UX:
 *
 * - Si el correo existe → se muestra un mensaje de éxito.
 * - Si no existe → muestra mensaje de error.
 *
 * Todo el objetivo es entregar un proceso claro y no bloquear al usuario.
 *
 * @usageNotes
 * - El formulario es pequeño: solo un email con validación básica.
 * - El resultado se maneja con `message` y `errorMessage`.
 * - Después de éxito, se redirige automáticamente al login.
 */
export class Recover implements OnInit {

  // ============================================================
  // 1) Inyección de dependencias
  // ============================================================

  /** FormBuilder para inicializar el formulario. */
  private fb = inject(FormBuilder);

  /** Servicio de autenticación encargado de `recoverPassword()`. */
  private auth = inject(AuthService);

  /** Router para redirigir a /auth/login después del flujo. */
  private router = inject(Router);

  // ============================================================
  // 2) State del formulario
  // ============================================================

  /** Formulario con un único campo: email. */
  form!: FormGroup;

  /** Flag para saber si ya se intentó enviar el formulario. */
  submitted = false;

  /** Mensaje de éxito luego del flujo. */
  message = '';

  /** Mensaje de error cuando el correo no es reconocido. */
  errorMessage = '';

  // ============================================================
  // 3) Inicialización del formulario
  // ============================================================

  /**
   * Construye el formulario con validación de email.
   */
  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  /** Acceso directo a los controles del formulario. */
  get f() {
    return this.form.controls;
  }

  /**
   * Indica si un control tiene un error y si ya debería mostrarse.
   *
   * @param controlName Nombre del campo (ej: 'email')
   * @param error Tipo de error (ej: 'required')
   */
  hasError(controlName: string, error: string): boolean {
    const control = this.form.get(controlName);
    if (!control) return false;

    return (
      (control.dirty || control.touched || this.submitted) &&
      control.hasError(error)
    );
  }

  // ============================================================
  // 4) Envío del formulario de recuperación
  // ============================================================

  /**
   * Flujo completo de recuperación:
   * - Valida el formulario
   * - Llama a AuthService.recoverPassword
   * - Muestra mensajes de error o éxito
   * - Redirige a login luego de una pequeña espera
   *
   * @example
   * <button (click)="onSubmit()">Recuperar contraseña</button>
   */
  onSubmit(): void {
    this.submitted = true;

    // reset interno
    this.message = '';
    this.errorMessage = '';

    // Si el formulario es inválido → mostrar errores y detener
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email } = this.form.value;

    // Llamada simulada (sin backend real)
    const result = this.auth.recoverPassword(email);

    // ERROR → correo no encontrado
    if (!result.success) {
      this.errorMessage = result.message;
      return;
    }

    // ÉXITO → mostrar mensaje informativo
    this.message = result.message;

    // Pequeño delay antes de redirigir
    setTimeout(() => {
      this.router.navigate(['/auth/login']);
    }, 1500);
  }
}
