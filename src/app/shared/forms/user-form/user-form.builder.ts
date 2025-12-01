// src/app/shared/forms/user-form/user-form.builder.ts
import { FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// --- Validador contraseña "fuerte" (igual que en register) ---
export const weakPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value as string;
  if (!value) return null;

  const hasNumber = /\d/.test(value);
  const hasUppercase = /[A-Z]/.test(value);

  return hasNumber && hasUppercase ? null : { weakPassword: true };
};

// --- Validador fecha de nacimiento (>= 13 años) ---
export const minAgeValidator = (minAge: number): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const birthDate = new Date(value);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= minAge ? null : { tooYoung: true };
  };
};

// --- Validador de coincidencia de contraseñas (a nivel de formGroup) ---
export const passwordsMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  if (!password || !confirm) return null;
  return password === confirm ? null : { passwordsDontMatch: true };
};

export function buildUserForm(fb: FormBuilder, options?: { includeRole?: boolean; includeIsActive?: boolean }) {
  const includeRole = options?.includeRole ?? false;
  const includeIsActive = options?.includeIsActive ?? false;

  const group = fb.group(
    {
      // 👇 mismos campos que el register.component.html
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(18),
          weakPasswordValidator,
        ],
      ],
      confirmPassword: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required, minAgeValidator(13)]],
      shippingAddress: [''],

      // 👇 campos extra para el admin
      role: includeRole ? ['user', [Validators.required]] : undefined,
      isActive: includeIsActive ? [true] : undefined,
    },
    {
      validators: [passwordsMatchValidator],
    }
  );

  return group;
}
