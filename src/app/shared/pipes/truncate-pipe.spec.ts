import { TruncatePipe } from './truncate-pipe';

describe('TruncatePipe', () => {
  let pipe: TruncatePipe;

  beforeEach(() => {
    pipe = new TruncatePipe();
  });

  /**
   * =====================================================
   * PRUEBA 1
   * Truncar texto largo
   * =====================================================
   */
  it('debería truncar un texto cuando supera el largo máximo', () => {
    // Arrange
    const text = 'Este es un texto muy largo para ser mostrado completo';
    const limit = 20;

    // Act
    const result = pipe.transform(text, limit);

    // Assert
    expect(result).toBe('Este es un texto...');
  });

  /**
   * =====================================================
   * PRUEBA 2
   * Texto corto no se trunca
   * =====================================================
   */
  it('no debería truncar el texto si es más corto que el límite', () => {
    // Arrange
    const text = 'Texto corto';

    // Act
    const result = pipe.transform(text, 20);

    // Assert
    expect(result).toBe(text);
  });
});
