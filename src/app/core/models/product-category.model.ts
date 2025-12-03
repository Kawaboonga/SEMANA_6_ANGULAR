
/**
 * Categorías principales de productos.
 *
 * Este union type asegura que solo se utilicen valores válidos cuando se
 * filtran productos, se crean rutas o se construyen secciones como:
 * - listados,
 * - filtros laterales,
 * - carrousels por categoría,
 * - tarjetas destacadas.
 *
 * Usar un tipo cerrado evita errores de escritura y mantiene consistencia
 * en toda la plataforma.
 *
 * @usageNotes
 * - Si agregas nuevas categorías en el proyecto, deben definirse aquí.
 * - Mantén los nombres en minúsculas para coincidir con slugs, filtros y rutas.
 * - Útil para filtros con chips, dropdowns o checkboxes.
 *
 * @example
 * const categoria: ProductCategory = 'guitarras';
 */
export type ProductCategory =
  | 'guitarras'
  | 'bajos'
  | 'pedales'
  | 'amplificadores'
  | 'accesorios'
  | 'otros';
