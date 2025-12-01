// src/app/core/models/product-category.ts

// Defino todas las categorías principales que puede tener un producto.
// Uso un union type porque esto asegura que solo se utilicen valores válidos
// y evita errores de escritura cuando se filtra o se construyen rutas.
export type ProductCategory =
  | 'guitarras'
  | 'bajos'
  | 'pedales'
  | 'amplificadores'
  | 'accesorios'
  | 'otros';
