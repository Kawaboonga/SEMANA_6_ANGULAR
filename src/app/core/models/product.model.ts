import { ProductCategory } from './product-category.model';

/**
 * Estado físico del producto.
 * Mantengo union types porque acá sí conviene restringir valores.
 *
 * @usageNotes
 * - Ideal para filtros: nuevo/usado.
 * - Evita inconsistencias al ingresar productos.
 */
export type ProductCondition = 'nuevo' | 'usado';

/**
 * Tipo de operación que se puede realizar con el producto.
 * Permite distinguir venta, intercambio, servicios o reparaciones.
 *
 * @usageNotes
 * - Se usa en filtros del listado y en vistas de detalle.
 */
export type ProductModality = 'venta' | 'intercambio' | 'servicio' | 'reparación';

/**
 * Nivel recomendado del usuario que lo utilizará.
 * Útil especialmente para instrumentos o equipos educativos.
 */
export type ProductLevel = 'principiante' | 'intermedio' | 'avanzado';

/**
 * Modelo principal del producto dentro del sistema.
 *
 * Se usa en:
 * - cards de productos
 * - listados y grillas
 * - página de detalle
 * - administración
 * - carrousels del home
 *
 * Este modelo es flexible porque muchos productos pueden no tener
 * todos los campos (por ejemplo, tags, modelo o previousPrice).
 *
 * @usageNotes
 * - `slug` es opcional: no todos los productos necesitan página dedicada.
 * - `previousPrice` permite manejar ofertas reales (antes / ahora).
 * - `year` puede ser string porque algunos equipos tienen rangos (“1990–1993”).
 * - Flags como `isFeatured`, `isOffer` o `showInCarousel` controlan la UI,
 *   no la lógica de negocio.
 *
 * @example
 * const p: Product = {
 *   id: '123',
 *   slug: 'fender-stratocaster',
 *   name: 'Fender Stratocaster Player',
 *   description: 'Strat moderna con tono brillante.',
 *   category: 'guitarras',
 *   price: 680000,
 *   condition: 'usado',
 *   level: 'intermedio',
 *   modality: 'venta',
 *   imageUrl: '/assets/img/products/strato.jpg'
 * };
 */
export interface Product {
  id: string;
  // ID único del producto (por ahora generado desde el front).

  slug?: string;
  // Identificador para URLs limpias. Ej: /productos/mi-guitarra-fender.

  name: string;
  // Nombre completo visible en cards, listas y detalle.

  description: string;
  // Descripción larga para la vista de detalle.

  shortDescription?: string;
  // Resumen breve pensado para cards y listados rápidos.

  category: ProductCategory;
  // Categoría general: guitarras, bajos, pedales, amplis, etc.

  price: number;
  // Precio actual (obligatorio).

  previousPrice?: number;
  // Para mostrar ofertas: precio anterior.

  currency?: string;
  // Moneda (por defecto CLP).

  brand?: string;
  // Marca del instrumento o equipo: Fender, Ibanez, Boss, etc.

  model?: string;
  // Modelo específico (Player, RG421, DS-1...).

  year?: number | string;
  // Año o rango. Puede venir como string para casos especiales.

  condition?: ProductCondition;
  // nuevo / usado.

  level?: ProductLevel;
  // Nivel recomendado del usuario.

  modality?: ProductModality;
  // venta / intercambio / servicio / reparación.

  stock?: number;
  // Cantidad disponible (útil para admin futuro).

  location?: string;
  // Ciudad/comuna donde está disponible.

  imageUrl?: string;
  // Imagen principal para mostrar en cards y detalle.

  tags?: string[];
  // Palabras clave para filtros y búsquedas.

  createdAt?: string;
  // Fecha de creación (ISO). Para destacar “nuevos ingresos”.

  rating?: number;
  reviewCount?: number;
  // Datos para mostrar estrellas y cantidad de reseñas.

  // ---- FLAGS PARA UI ----

  showInCarousel?: boolean;
  // Si es true → aparece en carrousels del home.

  isFeatured?: boolean;
  // Producto destacado (más visibilidad).

  isOffer?: boolean;
  // Activa la UI de oferta cuando hay previousPrice.

  isNew?: boolean;
  // Para destacar productos recientes.

  isActive?: boolean;
  // Control de visibilidad (para administración).

  isPreSale?: boolean;
  /**
   * Indica que el producto pertenece a la sección de PREVENTAS.
   *
   * @usageNotes
   * - Se puede usar para:
   *   - Filtrar productos en ProductService.getPreSales().
   *   - Mostrar una categoría/landing exclusiva de preventas.
   *   - Controlar qué productos aparecen en el módulo /preventas del admin.
   * - No reemplaza la categoría: una preventa sigue siendo, por ejemplo,
   *   una guitarra, pedal, ampli, etc.
   */
}
