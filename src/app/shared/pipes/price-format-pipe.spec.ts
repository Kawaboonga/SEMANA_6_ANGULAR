import { PriceFormatPipe } from './price-format-pipe';

/**
 * NOTA IMPORTANTE:
 * Este test NO necesita TestBed porque un Pipe es lógica pura.
 * Se puede instanciar directamente y probar su método transform(),
 * lo que hace la prueba más simple, rápida y precisa.
 */

describe('PriceFormatPipe', () => {
  let pipe: PriceFormatPipe;

  beforeEach(() => {
    // Creamos una instancia del pipe en cada test para mantener independencia.
    pipe = new PriceFormatPipe();
  });

  /**
   * =====================================================
   * PRUEBA 1
   * Formateo correcto de precio
   * =====================================================
   */
  it('debería formatear un número como precio en pesos chilenos', () => {
    // Arrange
    const value = 1000;

    // Act
    const result = pipe.transform(value);

    // Assert
    expect(result).toBe('$1.000');
  });

  /**
   * =====================================================
   * PRUEBA 2
   * Manejo de valores inválidos
   * =====================================================
   */
  it('debería retornar "-" cuando el valor es null o undefined', () => {
    // Act & Assert
    expect(pipe.transform(null)).toBe('-');
    expect(pipe.transform(undefined)).toBe('-');
  });

  /**
   * =====================================================
   * PRUEBA 3
   * Manejo de valores no numéricos
   * =====================================================
   */
  it('debería retornar "-" cuando el valor no es un número válido', () => {
    // Arrange
    const value = NaN;

    // Act
    const result = pipe.transform(value);

    // Assert
    expect(result).toBe('-');
  });

  /**
   * =====================================================
   * PRUEBA 4 (extra, recomendada para evaluación)
   * Formateo de números grandes
   * =====================================================
   */
  it('debería formatear correctamente precios grandes con separadores de miles', () => {
    // Arrange
    const value = 1500000;

    // Act
    const result = pipe.transform(value);

    // Assert
    expect(result).toBe('$1.500.000');
  });
});
