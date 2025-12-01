// src/app/core/models/product.ts

import { ProductCategory } from './product-category.model';

// Estado físico del producto.
// Mantengo union types porque acá sí conviene restringir valores.
export type ProductCondition = 'nuevo' | 'usado';

// Para indicar el tipo de operación que se puede hacer con el producto.
export type ProductModality = 'venta' | 'intercambio' | 'servicio' | 'reparación';

// Nivel del usuario al que está dirigido (útil para instrumentos).
export type ProductLevel = 'principiante' | 'intermedio' | 'avanzado';

// Modelo principal del producto.
// Este modelo es usado en cards, detalles, listados, admin, carrousels, etc.
export interface Product {
  id: string;             
  // ID único del producto. Lo manejo yo mismo y no proviene de backend aún.

  slug?: string;          
  // Identificador para URLs limpias: /productos/mi-guitarra-fender.
  // Lo dejo opcional por si hay productos sin página de detalle.

  name: string;           
  // Nombre completo del producto (visible en cards y detalle).

  description: string;    
  // Descripción larga para la página de detalle.

  shortDescription?: string;
  // Descripción corta para cards o listados rápidos.

  category: ProductCategory;
  // Categoría del producto: guitarras, bajos, pedales, amplis, etc.
  // Esto define filtros y organización en la UI.

  price: number;          
  // Precio actual del producto (obligatorio).

  previousPrice?: number;
  // Para mostrar ofertas o rebajas: antes / ahora.

  currency?: string;
  // Permite manejar otras monedas si es necesario.
  // Por defecto uso CLP desde el front.

  brand?: string;         
  // Marca del instrumento o equipo (Fender, Ibanez, Boss...).

  model?: string;         
  // Modelo específico.

  year?: number | string;    
  // Año del instrumento (muchos equipos tienen rango, ej: "1990-1993").
  // Por eso permito número o string.

  condition?: ProductCondition;
  // Estado: nuevo o usado.

  level?: ProductLevel;
  // Nivel recomendado para el usuario (útil para instrumentos educativos).

  modality?: ProductModality;
  // Tipo de operación: venta, intercambio, reparación, etc.

  stock?: number;
  // Cantidad disponible (en admin puede ser útil para controlar inventario).

  location?: string;
  // Ciudad/Comuna donde está disponible el producto.

  imageUrl?: string;
  // Imagen principal para mostrar en cards y detalle.

  tags?: string[];
  // Palabras clave para filtros, búsquedas o agrupaciones.

  createdAt?: string;
  // Fecha de creación. Sirve para destacar productos "nuevos" en el carrusel.

  rating?: number;
  reviewCount?: number;
  // Información para mostrar estrellas y cantidad de reseñas.

  // ---- FLAGS PARA LA UI ----

  showInCarousel?: boolean;
  // Si es true → aparece en carrousels del home.

  isFeatured?: boolean;
  // Producto destacado (prioridad visual).

  isOffer?: boolean;
  // Indica oferta (si hay previousPrice).

  isNew?: boolean;
  // Para destacar productos recientes.

  isActive?: boolean;
  // Si está activo o pausado (para admin futuro).
}
