// src/app/features/contacto/contacto.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { FadeUpDirective } from '@shared/directives/fade-up';

@Component({
  selector: 'app-contacto',
  standalone: true,
  templateUrl: './contacto.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FadeUpDirective, // animación appFadeUp
  ],
})
export class Contacto {
  form: FormGroup;

  // Flags UI
  submitted = false;   // Mensaje de éxito
  sending = false;     // Estado "enviando"

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  // ============================================================
  // VALIDACIONES
  // ============================================================
  hasError(controlName: string, error: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.touched && control.hasError(error);
  }

  // ============================================================
  // ENVIAR FORMULARIO
  // ============================================================
  onSubmit(): void {
    this.submitted = false;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.sending = true;

    const payload = this.form.value;
    console.log('📨 Formulario de contacto enviado:', payload);

    // Simular envío real
    setTimeout(() => {
      this.sending = false;
      this.submitted = true;
      this.form.reset();
    }, 800);
  }

  // ============================================================
  // LIMPIAR FORMULARIO
  // ============================================================
  onClear(): void {
    this.form.reset();
    this.submitted = false;
  }
}
