
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule,} from '@angular/forms';

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

/**
 * Página de contacto del sitio.
 *
 * Este formulario permite que un usuario envíe un mensaje interno
 * (consulta, sugerencia o problema). No existe backend real, por lo que
 * el envío se simula con un `setTimeout` y se muestra un mensaje de éxito.
 *
 * UX:
 * - Validaciones claras en cada campo.
 * - Botón deshabilitado mientras "se envía".
 * - Mensaje de confirmación tras completar el flujo.
 * - Botón para limpiar todo el formulario.
 *
 * El componente está pensado para mantenerse liviano: no usa servicios,
 * solo consola y estados locales.
 */
export class Contacto {
  /** Formulario reactivo con los campos principales del contacto. */
  form: FormGroup;

  /** Flag que indica si se mostró el mensaje de éxito. */
  submitted = false;

  /** Flag que controla el estado de "enviando". */
  sending = false;

  /**
   * Construye el formulario con validaciones básicas:
   * - name: requerido + mínimo 3 caracteres
   * - email: requerido + formato válido
   * - subject: requerido + mínimo 5 caracteres
   * - message: requerido + mínimo 10 caracteres
   */
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

  /**
   * Verifica si un control tiene un error concreto y si ya fue tocado.
   * Se usa directamente desde la plantilla para mostrar mensajes.
   *
   * @param controlName Nombre del campo.
   * @param error Tipo de error a validar (required, minlength, email…).
   */
  hasError(controlName: string, error: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.touched && control.hasError(error);
  }

  // ============================================================
  // ENVIAR FORMULARIO
  // ============================================================

  /**
   * Maneja el flujo completo del envío:
   * - valida el form,
   * - muestra spinner,
   * - simula el envío,
   * - limpia y muestra mensaje final.
   *
   * En un proyecto real, este método enviaría los datos a una API.
   */
  onSubmit(): void {
    this.submitted = false;

    // Si el formulario tiene errores, los mostramos de inmediato
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Spinner ON
    this.sending = true;

    const payload = this.form.value;
    console.log('Formulario de contacto enviado:', payload);

    // Simulación de envío real
    setTimeout(() => {
      this.sending = false;
      this.submitted = true;
      this.form.reset();
    }, 800);
  }

  // ============================================================
  // LIMPIAR FORMULARIO
  // ============================================================

  /**
   * Limpia todos los campos del formulario y oculta el mensaje de éxito.
   * Útil cuando el usuario quiere “partir de cero”.
   */
  onClear(): void {
    this.form.reset();
    this.submitted = false;
  }
}
