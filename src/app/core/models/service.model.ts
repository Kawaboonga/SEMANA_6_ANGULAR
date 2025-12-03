/**
 * Modelo principal para los servicios ofrecidos en SoundSeeker.
 *
 * Representa cada tipo de servicio disponible en la plataforma:
 * compra, venta, intercambio, mantención, reparaciones y pintura.  
 * Se usa en las cards del home, en la lista de servicios y en la página
 * de detalle para cada uno.
 *
 * @usageNotes
 * - `slug` es clave para las rutas dinámicas: /servicios/:slug.
 * - `description` se maneja como arreglo para facilitar bloques de texto
 *   sin concatenar strings largos.
 * - `icon` usa clases de Bootstrap Icons para reforzar el tipo de servicio.
 * - Mantén consistencia en `id` y `slug` para que los servicios sean fáciles de mapear.
 *
 * @example
 * const servicio: Service = {
 *   id: 'compra',
 *   slug: 'compra',
 *   name: 'Compra de instrumentos',
 *   shortDescription: 'Encuentra guitarras y equipos usados en buen estado.',
 *   description: [
 *     'Texto más largo dividido en secciones.',
 *   ],
 *   imageUrl: '/assets/img/services/compra.jpg',
 *   icon: 'bi-bag-check'
 * };
 */
export interface Service {
  id: string;
  // Identificador interno del servicio.
  // Lo uso para mapear categorías o trabajar con mocks.

  slug: string;
  // Slug visible en la URL. Ej: /servicios/compra
  // Importante para rutas dinámicas.

  name: string;
  // Nombre del servicio, mostrado en cards y en el título del detalle.

  shortDescription: string;
  // Resumen breve pensado para tarjetas y listados.
  // Debe ser directo y fácil de leer.

  description: string[];
  // Descripción detallada como bloques independientes.
  // Facilita dividir texto largo en secciones más manejables.

  imageUrl: string;
  // Imagen principal del servicio.
  // Idealmente alojada en /assets/img/services/.

  icon: string;
  // Ícono visual asociado (Bootstrap Icons).
  // Ej: 'bi-bag-check', 'bi-tools', etc.
}
