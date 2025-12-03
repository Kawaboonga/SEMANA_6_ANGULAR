
import { TestBed } from '@angular/core/testing';
import { AuthService, RegisterPayload } from './auth.service';
import { User } from '@core/models/user.model';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);

    // Limpiamos cualquier sesión anterior en localStorage
    localStorage.clear();
  });

  it('debería registrar un usuario nuevo y dejarlo como currentUser', () => {
    // Arrange
    const initialCount = service.users().length;

    const payload: RegisterPayload = {
      firstName: 'Nuevo',
      lastName: 'Usuario',
      email: 'nuevo@soundseeker.cl',
      password: 'Password1',
    };

    // Act
    const result = service.register(payload);

    // Assert
    expect(result.success).toBeTrue();
    expect(service.users().length).toBe(initialCount + 1);

    const currentUser = service.currentUser();
    expect(currentUser).not.toBeNull();
    expect(currentUser?.email).toBe(payload.email.toLowerCase());
  });

  it('no debería permitir registrar un correo duplicado', () => {
    // Arrange
    // En el seed del servicio ya existe admin@soundseeker.cl
    const initialCount = service.users().length;

    const payloadDuplicado: RegisterPayload = {
      firstName: 'Otro',
      lastName: 'Admin',
      email: 'admin@soundseeker.cl', // ya existe en _users
      password: 'Admin123',
    };

    // Act
    const result = service.register(payloadDuplicado);

    // Assert
    expect(result.success).toBeFalse();
    expect(result.message).toBe('Ya existe un usuario registrado con este correo.');
    expect(service.users().length).toBe(initialCount); // NO se agregó un nuevo usuario
  });
});
