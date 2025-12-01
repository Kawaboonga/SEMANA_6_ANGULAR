export interface Service {
  id: string;          
  // Identificador interno del servicio.
  // Lo uso principalmente para organizar data o mapear categorías.

  slug: string;        
  // Slug que va en la URL, por ejemplo: /servicios/compra.
  // Importante para las rutas dinámicas en Angular.

  name: string;        
  // Nombre visible del servicio. Ej: "Compra de instrumentos".

  shortDescription: string;
  // Texto breve para mostrar en cards del home o listados.
  // Debe ser conciso para no saturar la interfaz.

  description: string[];
  // Descripción más larga dividida en párrafos.
  // Esto facilita mostrar varias secciones de texto sin concatenar strings grandes.

  imageUrl: string;
  // Imagen principal del servicio (se usa en cards y en la página de detalle).
  // Idealmente alojada en /assets/img/services/.

  icon: string;
  // Nombre del ícono Bootstrap Icons asociado al servicio.
  // Ejemplo: 'bi-bag-check' o 'bi-gear'.
  // Sirve para reforzar visualmente el tipo de servicio.
}
