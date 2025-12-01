// src/app/features/auth/login/login.ts

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
export class LoginComponent {
  // ============================================================
  // 1) STATE DEL FORMULARIO
  // ============================================================

  // Grupo reactivo con los campos de login.
  form: FormGroup;

  // Simple flag para saber si ya se intentó hacer submit.
  submitted = false;

  // Flag para mostrar estado de "cargando" (deshabilitar botón, etc.).
  loading = false;

  // Mensajes que se muestran en el template según resultado del login.
  /** Mensajes de error o éxito */
  errorMessage = '';
  successMessage = '';

  // ============================================================
  // 2) INYECCIONES Y CONFIGURACIÓN INICIAL
  // ============================================================

  constructor(
    private fb: FormBuilder,   // para construir el FormGroup
    private auth: AuthService, // maneja el login y el usuario actual
    private router: Router     // para redirigir después de login
  ) {
    // Definición del formulario reactivo:
    // - email: requerido + formato de correo
    // - password: requerido (validación básica)
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  // ============================================================
  // 3) Helper de validaciones para el HTML
  // ============================================================
  // Devuelve true si el control está tocado y tiene el error indicado.
  // Lo uso para mostrar mensajes de error específicos en el template.
  hasError(control: string, code: string): boolean {
    const ctrl = this.form.get(control);
    return !!ctrl && ctrl.touched && ctrl.hasError(code);
  }

  // ============================================================
  // 4) SUBMIT DEL FORMULARIO DE LOGIN
  // ============================================================
  // Maneja el flujo completo:
  // - marca el form como enviado
  // - valida
  // - llama al AuthService
  // - setea mensajes y redirige si todo sale bien
  onSubmit(): void {
    this.submitted = true;

    // Si el formulario no es válido, marco todos los campos como tocados
    // para que se muestren los mensajes de error y corto el flujo.
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Estado de "cargando" mientras se procesa el login.
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Extraigo el email y la contraseña del form.
    const { email, password } = this.form.value;

    // Llamada al servicio de autenticación.
    // En este proyecto, AuthService.login trabaja en memoria (demo local).
    const result = this.auth.login({ email, password });

    // Si el login falla, muestro el mensaje y desactivo el loading.
    if (!result.success) {
      this.errorMessage =
        result.message ?? 'Ocurrió un error al iniciar sesión. Intenta nuevamente.';
      this.loading = false;
      return;
    }

    // Si todo salió bien, muestro un mensaje corto y redirijo al área privada.
    this.successMessage = 'Inicio de sesión exitoso. Redirigiendo...';

    // Pequeño delay para que alcance a verse el mensaje en la interfaz.
    setTimeout(() => {
      this.router.navigate(['/mi-cuenta']);
    }, 800);
  }
}
