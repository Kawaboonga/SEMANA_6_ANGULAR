// src/app/features/auth/recover-password/recover-password.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
export class Recover implements OnInit {
  // ============================================================
  // 1) Inyección de dependencias
  // ============================================================
  // FormBuilder para armar el formulario reactivo.
  private fb = inject(FormBuilder);
  // Servicio de autenticación que expone recoverPassword().
  private auth = inject(AuthService);
  // Router para redirigir de vuelta al login después del flujo.
  private router = inject(Router);

  // ============================================================
  // 2) State del formulario
  // ============================================================
  // FormGroup con el campo de correo.
  form!: FormGroup;

  // Flag para saber si ya se intentó enviar el formulario.
  submitted = false;

  // Mensaje informativo cuando el flujo se completa correctamente.
  message = '';

  // Mensaje de error cuando no se encuentra el correo u otro problema.
  errorMessage = '';

  // ============================================================
  // 3) Inicialización del formulario
  // ============================================================
  ngOnInit(): void {
    // Formulario simple de un solo campo:
    // email → requerido + formato de correo.
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  // Acceso rápido a los controles del formulario desde el template.
  get f() {
    return this.form.controls;
  }

  // Helper genérico para saber si un control tiene un error concreto
  // y si ya debería mostrarse en pantalla.
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
  onSubmit(): void {
    this.submitted = true;
    // Reset de mensajes cada vez que se intenta un submit.
    this.message = '';
    this.errorMessage = '';

    // Si el formulario no es válido, marco todo como tocado para
    // que se muestren los mensajes de error y corto el flujo.
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Extraigo el correo desde el formulario.
    const { email } = this.form.value;

    // Llamada al método de recuperación en AuthService.
    // En este contexto, solo simula el envío (no hay backend real).
    const result = this.auth.recoverPassword(email);

    // Si la operación no fue exitosa, muestro el mensaje de error
    // que entrega el servicio y dejo al usuario en la misma vista.
    if (!result.success) {
      this.errorMessage = result.message;
      return;
    }

    // Si fue exitosa, muestro el texto informativo.
    this.message = result.message;

    // Pequeño delay antes de redirigir al login,
    // para que el mensaje se alcance a leer.
    setTimeout(() => {
      this.router.navigate(['/auth/login']);
    }, 1500);
  }
}
