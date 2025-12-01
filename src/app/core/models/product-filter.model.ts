import { ProductCategory } from './product-category.model';

// Este modelo define todos los filtros disponibles para la página/listado de productos.
// Lo uso para centralizar el manejo de filtros y evitar estar pasando mil variables sueltas.
// Cada propiedad es opcional para permitir combinar filtros libremente.
export interface ProductFilter {
  searchTerm?: string;
  // Texto ingresado por el usuario para buscar por nombre, marca o modelo.
  // Ideal para barra de búsqueda rápida.

  category?: ProductCategory | 'todos';
  // Categoría seleccionada por el usuario.
  // Incluyo 'todos' para representar la opción de no filtrar.

  minPrice?: number;
  // Límite inferior del precio. Útil para sliders o inputs numéricos.

  maxPrice?: number;
  // Límite superior del precio.

  sortBy?: 'recent' | 'priceAsc' | 'priceDesc';
  // Maneja el ordenamiento del listado.
  // - recent → productos nuevos primero
  // - priceAsc → precio menor a mayor
  // - priceDesc → precio mayor a menor

  condition?: 'nuevo' | 'usado' | 'todos';
  // Permite filtrar por estado del producto (nuevo/usado).
  // 'todos' sirve para resetear el filtro.
}
