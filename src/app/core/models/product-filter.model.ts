import { ProductCategory } from './product-category.model';

/**
 * Filtros disponibles para la página de productos.
 *
 * Este modelo centraliza todos los filtros del listado para evitar
 * estar manejando variables sueltas o estados dispersos.  
 * Cada propiedad es opcional para que el usuario pueda combinar filtros
 * libremente (categoría + rango de precio + condición + orden, etc.).
 *
 * Se usa en:
 * - la barra de búsqueda,
 * - filtros laterales,
 * - sliders de precio,
 * - ordenamiento del listado,
 * - y en cualquier componente que necesite filtrar productos.
 *
 * @usageNotes
 * - Si agregas nuevos filtros visuales, defínelos también aquí.
 * - `category` y `condition` incluyen la opción `'todos'` para resetear filtros.
 * - Mantener este modelo limpio ayuda a que manejar la UI sea mucho más simple.
 *
 * @example
 * const filtros: ProductFilter = {
 *   searchTerm: 'Fender',
 *   category: 'guitarras',
 *   minPrice: 100000,
 *   condition: 'usado',
 *   sortBy: 'priceAsc'
 * };
 */
export interface ProductFilter {
  searchTerm?: string;
  // Búsqueda por nombre, marca o modelo.
  // Se usa en la barra de búsqueda rápida.

  category?: ProductCategory | 'todos';
  // Filtra por categoría (guitarras, bajos, pedales, etc.).
  // 'todos' → sin filtro.

  minPrice?: number;
  // Límite inferior del precio (sliders, inputs).

  maxPrice?: number;
  // Límite superior del precio.

  sortBy?: 'recent' | 'priceAsc' | 'priceDesc';
  // Ordenamiento del listado:
  // - recent → productos nuevos primero
  // - priceAsc → menor a mayor
  // - priceDesc → mayor a menor

  condition?: 'nuevo' | 'usado' | 'todos';
  // Filtrar por estado físico del producto.
  // 'todos' para desactivar el filtro.
}
