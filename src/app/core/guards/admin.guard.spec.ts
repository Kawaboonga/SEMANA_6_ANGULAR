import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { adminGuard } from './admin-guard';


describe('adminGuard', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    /**
     * Se crea spies (dobles) para controlar el comportamiento del AuthService
     * y del Router sin depender de navegación real.
     *
     * - authServiceSpy.isAdmin() lo vamos a forzar a true/false según el caso.
     * - routerSpy.navigate() nos permitirá comprobar si hubo redirección.
     */
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['isAdmin']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
  });

  /**
   * =====================================================
   * PRUEBA 1
   * Si el usuario ES admin, permite el acceso
   * =====================================================
   */
  it('debería permitir la navegación cuando el usuario es admin', () => {
    // Arrange
    authServiceSpy.isAdmin.and.returnValue(true);

    /**
     * IMPORTANTE:
     * Como el guard usa inject(), debemos ejecutarlo dentro del
     * contexto de inyección de Angular para que inject() funcione.
     */
    const result = TestBed.runInInjectionContext(() =>
      adminGuard({} as any, {} as any)
    );

    // Assert
    expect(result).toBeTrue();

    /**
     * Si el usuario es admin, NO se debe redirigir.
     * Esto valida que el guard no hace navegación innecesaria.
     */
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  /**
   * =====================================================
   * PRUEBA 2
   * Si el usuario NO es admin, bloquea y redirige
   * =====================================================
   */
  it('debería bloquear la navegación y redirigir a /mi-cuenta cuando el usuario no es admin', () => {
    // Arrange
    authServiceSpy.isAdmin.and.returnValue(false);

    // Act
    const result = TestBed.runInInjectionContext(() =>
      adminGuard({} as any, {} as any)
    );

    // Assert
    /**
     * Cuando no es admin:
     * - el guard debe devolver false para bloquear la ruta
     * - y debe redirigir a /mi-cuenta
     */
    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/mi-cuenta']);
  });

  /**
   * =====================================================
   * PRUEBA 3
   * Validar que SIEMPRE consulte isAdmin()
   * =====================================================
   *
   * Esta prueba suma puntos porque demuestra que el guard
   * realmente depende del rol y no de condiciones "magias".
   */
  it('debería consultar el rol de admin en AuthService', () => {
    // Arrange
    authServiceSpy.isAdmin.and.returnValue(true);

    // Act
    TestBed.runInInjectionContext(() => adminGuard({} as any, {} as any));

    // Assert
    expect(authServiceSpy.isAdmin).toHaveBeenCalled();
  });
});
