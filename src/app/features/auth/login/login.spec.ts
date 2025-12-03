import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';

import { LoginComponent } from './login';
import { AuthService } from '@core/services/auth.service';

// Mock sencillo para AuthService
const authServiceMock = {
  login: jasmine.createSpy('login'),
};

// Mock sencillo para Router
const routerMock = {
  navigate: jasmine.createSpy('navigate'),
};

describe('LoginComponent', () => {
  let component: LoginComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent, // es standalone, se importa directo
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Reseteamos los spies antes de cada test
    authServiceMock.login.calls.reset();
    routerMock.navigate.calls.reset();
  });

  it('no debería llamar a auth.login si el formulario es inválido', () => {
    // Arrange
    component.form.reset(); // nos aseguramos de que esté vacío
    expect(component.form.invalid).toBeTrue();

    // Act
    component.onSubmit();

    // Assert
    expect(authServiceMock.login).not.toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });

  it('debería llamar a auth.login y navegar a /mi-cuenta con credenciales correctas', fakeAsync(() => {
    // Arrange
    authServiceMock.login.and.returnValue({
      success: true,
      message: 'Inicio de sesión exitoso',
    });

    component.form.setValue({
      email: 'admin@soundseeker.cl',
      password: 'Admin123',
    });

    // Act
    component.onSubmit();

    // Assert inmediato (antes del setTimeout)
    expect(authServiceMock.login).toHaveBeenCalledWith({
      email: 'admin@soundseeker.cl',
      password: 'Admin123',
    });
    expect(component.successMessage).toContain('exitoso');

    // Simulamos el delay de 800 ms del setTimeout
    tick(800);

    expect(routerMock.navigate).toHaveBeenCalledWith(['/mi-cuenta']);
    expect(component.loading).toBeFalse();
  }));
});
