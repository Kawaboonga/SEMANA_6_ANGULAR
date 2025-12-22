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

    /**
     * IMPORTANTE:
     * Antes de cada prueba limpiamos el localStorage
     * para asegurarnos de que los tests sean independientes
     * y no se vean afectados por ejecuciones anteriores.
     */
    localStorage.clear();
  });

  /**
   * =====================================================
   * PRUEBA 1
   * Registro de un usuario nuevo
   * =====================================================
   */
  it('debería registrar un usuario nuevo y dejarlo como currentUser', () => {
    // Arrange
    // Guardamos la cantidad inicial de usuarios
    const initialCount = service.users().length;

    const payload: RegisterPayload = {
      firstName: 'Nuevo',
      lastName: 'Usuario',
      email: 'nuevo@soundseeker.cl',
      password: 'Password1',
    };

    // Act
    // Ejecutamos el método register del servicio
    const result = service.register(payload);

    // Assert
    // Validamos que el registro haya sido exitoso
    expect(result.success).toBeTrue();

    // Validamos que el usuario se haya agregado a la lista
    expect(service.users().length).toBe(initialCount + 1);

    // Validamos que el usuario registrado quede como usuario actual
    const currentUser = service.currentUser();
    expect(currentUser).not.toBeNull();
    expect(currentUser?.email).toBe(payload.email.toLowerCase());
  });

  /**
   * =====================================================
   * PRUEBA 2
   * Registro con correo duplicado
   * =====================================================
   */
  it('no debería permitir registrar un correo duplicado', () => {
    // Arrange
    // En el seed del servicio ya existe el usuario admin@soundseeker.cl
    const initialCount = service.users().length;

    const payloadDuplicado: RegisterPayload = {
      firstName: 'Otro',
      lastName: 'Admin',
      email: 'admin@soundseeker.cl',
      password: 'Admin123',
    };

    // Act
    const result = service.register(payloadDuplicado);

    // Assert
    // El registro debe fallar
    expect(result.success).toBeFalse();

    // Se debe entregar un mensaje claro de error
    expect(result.message).toBe(
      'Ya existe un usuario registrado con este correo.'
    );

    // La cantidad de usuarios NO debe cambiar
    expect(service.users().length).toBe(initialCount);
  });

  /**
   * =====================================================
   * PRUEBA 3
   * Login exitoso
   * =====================================================
   */
  it('debería permitir iniciar sesión con credenciales válidas', () => {
    // Arrange
    const credentials = {
      email: 'admin@soundseeker.cl',
      password: 'Admin123',
    };

    // Act
    const result = service.login(credentials);

    // Assert
    // El login debe ser exitoso
    expect(result).toBeTrue();

    // El servicio debe marcar al usuario como autenticado
    expect(service.isLoggedIn()).toBeTrue();

    // El usuario actual debe existir
    const currentUser = service.currentUser();
    expect(currentUser).not.toBeNull();
    expect(currentUser?.email).toBe(credentials.email);
  });

  /**
   * =====================================================
   * PRUEBA 4
   * Logout (cierre de sesión)
   * =====================================================
   */
  it('debería cerrar sesión y limpiar el estado del usuario', () => {
    // Arrange
    // Primero iniciamos sesión con credenciales válidas
    service.login({
      email: 'admin@soundseeker.cl',
      password: 'Admin123',
    });

    // Confirmamos que el usuario quedó autenticado
    expect(service.isLoggedIn()).toBeTrue();

    // Act
    // Ejecutamos el logout
    service.logout();

    // Assert
    // El usuario ya no debe estar autenticado
    expect(service.isLoggedIn()).toBeFalse();

    // El usuario actual debe ser null
    expect(service.currentUser()).toBeNull();
  });
});
