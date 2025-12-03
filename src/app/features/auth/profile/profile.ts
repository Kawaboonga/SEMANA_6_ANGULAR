
import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators,} from '@angular/forms';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})

/**
 * Página de perfil del usuario.
 *
 * Muestra los datos personales del usuario logueado y permite modificar:
 * - Nombre
 * - Apellido
 * - Dirección de envío
 * - Fecha de nacimiento
 *
 * El correo se deja bloqueado (readonly) porque es parte del identificador
 * del usuario dentro del sistema.
 *
 * El componente usa:
 * - Signals (`currentUser`) para obtener el usuario activo
 * - Formulario reactivo validado
 * - AuthService para persistir los cambios
 *
 * @usageNotes
 * - Si no existe usuario logueado, no se inicializa el formulario.
 * - `onSubmit()` es el flujo central del guardado.
 * - El mensaje de éxito se maneja mediante flags simples.
 */

export class Profile implements OnInit {

  // ============================================================
  // 1) Inyección de dependencias
  // ============================================================

  /** FormBuilder para construir el formulario reactivo. */
  private fb = inject(FormBuilder);

  /** AuthService: expone el usuario actual y la función de actualización. */
  private auth = inject(AuthService);

  /**
   * Usuario actualmente logueado.
   * Se expone como signal mediante `computed` para consumo directo en la vista.
   */
  currentUser = computed(() => this.auth.currentUser());

  // ============================================================
  // 2) State del formulario y flags
  // ============================================================

  /** FormGroup con los datos del perfil. */
  form!: FormGroup;

  /** Flag que indica si ya se intentó enviar el formulario. */
  submitted = false;

  /** Mensaje de éxito mostrado después de actualizar el perfil. */
  successMessage = '';

  /** Controla el *ngIf del mensaje de confirmación. */
  hasSuccessMessage = false;

  // ============================================================
  // 3) Inicialización del formulario
  // ============================================================

  /**
   * Crea el formulario precargado con los datos del usuario actual.
   * Si no hay usuario logueado, simplemente evita inicializar el form.
   */
  ngOnInit(): void {
    const user = this.currentUser();
    if (!user) return;

    this.form = this.fb.group({
      firstName: [
        user.firstName,
        [Validators.required, Validators.minLength(2)],
      ],
      lastName: [
        user.lastName,
        [Validators.required, Validators.minLength(2)],
      ],
      // El correo queda bloqueado (readonly)
      email: [{ value: user.email, disabled: true }],
      shippingAddress: [user.shippingAddress || ''],
      dateOfBirth: [user.dateOfBirth, [Validators.required]],
    });
  }

  // ============================================================
  // 4) Getters y helpers de validación
  // ============================================================

  /** Acceso directo a los controles del formulario desde el template. */
  get f() {
    return this.form.controls;
  }

  /**
   * Indica si un control tiene un error específico
   * y si ya debería mostrarse en pantalla (dirty/touched/submitted).
   *
   * @param controlName Nombre del control del formulario
   * @param error Código de error (ej: 'required')
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
  // 5) Guardar cambios del perfil
  // ============================================================

  /**
   * Flujo principal del guardado:
   * - Valida el formulario
   * - Obtiene el usuario actual
   * - Llama a AuthService.updateUser con los cambios
   * - Muestra mensaje de éxito
   *
   * @example
   * <button (click)="onSubmit()">Guardar cambios</button>
   */
  onSubmit(): void {
    this.submitted = true;

    // Se limpia cualquier mensaje previo
    this.hasSuccessMessage = false;
    this.successMessage = '';

    if (!this.form || this.form.invalid) {
      this.form?.markAllAsTouched();
      return;
    }

    const user = this.currentUser();
    if (!user) return;

    const { firstName, lastName, shippingAddress, dateOfBirth } =
      this.form.getRawValue();

    // Actualización real del usuario
    this.auth.updateUser({
      ...user,
      firstName,
      lastName,
      shippingAddress,
      dateOfBirth,
    });

    // Feedback visual
    this.successMessage = 'Perfil actualizado correctamente.';
    this.hasSuccessMessage = true;
  }
}
