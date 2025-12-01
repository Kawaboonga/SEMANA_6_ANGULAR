// src/app/features/auth/register/register.component.ts

import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { buildUserForm } from '@shared/forms/user-form/user-form.builder';
import { FadeUpDirective } from '@shared/directives/fade-up';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FadeUpDirective],
  templateUrl: './register.html',
})
export class RegisterComponent {
  // ============================================================
  // 1) STATE DEL COMPONENTE
  // ============================================================
  // Formulario reactivo de registro (se construye con buildUserForm).
  form: FormGroup;

  // Flag simple para saber si ya se intentó enviar el formulario.
  submitted = false;

  // Vista previa del nombre completo que se muestra en el template.
  displayNamePreview = '';

  // Mensajes para feedback visual (error / éxito).
  errorMessage = '';
  successMessage = '';

  // ============================================================
  // 2) CONSTRUCTOR
  // ============================================================
  constructor(private fb: FormBuilder) {
    // El builder de formulario se reutiliza desde user-form.
    // En el registro público no se exponen ni el rol ni el estado isActive.
    this.form = buildUserForm(this.fb, {
      includeRole: false,
      includeIsActive: false,
    });
  }

  // ============================================================
  // 3) HELPERS DE VALIDACIÓN
  // ============================================================
  // Devuelve true si un control tiene un error específico y ya fue tocado.
  hasError(controlName: string, errorCode: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.touched && control.hasError(errorCode);
  }

  // ============================================================
  // 4) VISTA PREVIA DE NOMBRE COMPLETO
  // ============================================================
  // Se ejecuta al escribir en nombre/apellido para armar un "preview"
  // del nombre completo en el formulario.
  onNameKeyup(): void {
    const first = this.form.get('firstName')?.value || '';
    const last = this.form.get('lastName')?.value || '';
    const full = `${first} ${last}`.trim();
    this.displayNamePreview = full || '';
  }

  // ============================================================
  // 5) SUBMIT DEL FORMULARIO
  // ============================================================
  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Si el formulario no es válido, marcamos todo para que se
    // muestren los mensajes de error y detenemos el flujo.
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Datos listos para enviar a un servicio real de registro.
    const formValue = this.form.value;
    console.log('Registro usuario', formValue);

    // Aquí más adelante se conecta con el AuthService o API.
    // Por ahora solo se deja el console.log como placeholder.
    this.successMessage = 'Registro enviado correctamente (simulado).';
  }

  // ============================================================
  // 6) RESET DEL FORMULARIO
  // ============================================================
  // Propiedad de solo lectura para saber si vale la pena mostrar
  // o habilitar el botón de "Limpiar" en la plantilla.
  get canResetForm(): boolean {
    return this.form.dirty || this.form.touched;
  }

  // Limpia todos los campos del formulario y borra el preview.
  onReset(): void {
    this.form.reset();
    this.displayNamePreview = '';
    this.submitted = false;
    this.errorMessage = '';
    this.successMessage = '';
  }
}
