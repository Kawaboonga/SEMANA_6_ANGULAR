// src/app/features/auth/profile/profile.component.ts

import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class Profile implements OnInit {
  // ============================================================
  // 1) Inyección de dependencias
  // ============================================================
  // FormBuilder para armar el formulario reactivo del perfil.
  private fb = inject(FormBuilder);
  // AuthService expone el usuario actual y permite actualizarlo.
  private auth = inject(AuthService);

  // Usuario actualmente logueado (signal que viene de AuthService).
  currentUser = computed(() => this.auth.currentUser());

  // ============================================================
  // 2) State del formulario
  // ============================================================
  // FormGroup con los campos del perfil.
  form!: FormGroup;

  // Flag simple para saber si se intentó guardar al menos una vez.
  submitted = false;

  // Texto del mensaje de éxito que se muestra debajo del formulario.
  successMessage = '';

  // Flag para controlar el *ngIf del mensaje de éxito.
  hasSuccessMessage = false;

  // ============================================================
  // 3) Inicialización del formulario
  // ============================================================
  ngOnInit(): void {
    const user = this.currentUser();
    if (!user) return; // si no hay usuario logueado, no inicializa el form

    // Se cargan los datos actuales del usuario en el formulario.
    this.form = this.fb.group({
      firstName: [
        user.firstName,
        [Validators.required, Validators.minLength(2)],
      ],
      lastName: [
        user.lastName,
        [Validators.required, Validators.minLength(2)],
      ],
      // El correo se mantiene bloqueado, solo lectura.
      email: [{ value: user.email, disabled: true }],
      shippingAddress: [user.shippingAddress || ''],
      dateOfBirth: [user.dateOfBirth, [Validators.required]],
    });
  }

  // ============================================================
  // 4) Getters y helpers de validación
  // ============================================================
  // Acceso rápido a los controles del form en el template.
  get f() {
    return this.form.controls;
  }

  // Helper para saber si un control tiene un error específico
  // y si ya debería mostrarse en pantalla (touched/dirty/submitted).
  hasError(controlName: string, error: string): boolean {
    const control = this.form.get(controlName);
    if (!control) return false;

    return (
      (control.dirty || control.touched || this.submitted) &&
      control.hasError(error)
    );
  }

  // ============================================================
  // 5) Guardar cambios del perfil
  // ============================================================
  onSubmit(): void {
    this.submitted = true;

    // Al enviar, limpiamos primero cualquier mensaje previo.
    this.hasSuccessMessage = false;
    this.successMessage = '';

    // Si el formulario no es válido, marcamos todos los campos
    // para que se muestren los mensajes de error y frenamos el flujo.
    if (!this.form || this.form.invalid) {
      this.form?.markAllAsTouched();
      return;
    }

    const user = this.currentUser();
    if (!user) return;

    // getRawValue incluye también campos deshabilitados si los hubiera.
    const { firstName, lastName, shippingAddress, dateOfBirth } =
      this.form.getRawValue();

    // Se envían los cambios al AuthService para actualizar el usuario.
    this.auth.updateUser({
      ...user,
      firstName,
      lastName,
      shippingAddress,
      dateOfBirth,
    });

    // Mensaje de confirmación que se muestra en la vista.
    this.successMessage = 'Perfil actualizado correctamente.';
    this.hasSuccessMessage = true;
  }
}
