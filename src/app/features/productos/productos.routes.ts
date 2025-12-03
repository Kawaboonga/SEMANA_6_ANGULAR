
import { Routes } from '@angular/router';

/**
 * Rutas del feature "Productos".
 *
 * Este módulo agrupa:
 * - El listado general de productos.
 * - Listados filtrados por categoría.
 * - La vista de detalle de un producto específico.
 * - Cada ruta define metadata para breadcrumbs.
 * 
 * 
 * El patrón usa `loadComponent()` para cargar componentes standalone
 * bajo demanda, manteniendo el bundle principal más liviano.
 *
 * @usageNotes
 * - El breadcrumb se compone dinámicamente según el valor en `data`.
 * - Las rutas utilizan `slug` para URLs limpias.
 * - Tanto el listado general como el listado por categoría usan el mismo componente.
 *
 * @example
 * // Navegar a guitarras:
 * router.navigate(['/productos/categoria/guitarras']);
 */
export const PRODUCT_ROUTES: Routes = [
  // ============================================================
  // LISTADO DE PRODUCTOS (TODOS)
  // /productos
  //
  // Vista principal: muestra el grid completo de productos sin filtros.
  // Se usa ProductListComponent para controlar filtros, ordenamiento
  // y visualización general.
  // ============================================================
  {
    path: '',
    loadComponent: () =>
      import('./product-list/product-list').then(
        m => m.ProductListComponent
      ),
    data: {
      breadcrumb: 'Productos',
    },
  },

  // ============================================================
  // LISTADO POR CATEGORÍA
  // /productos/categoria/:slug
  //
  // - slug debe coincidir con ProductCategory:
  //   'guitarras' | 'bajos' | 'pedales' | 'amplificadores' | 'accesorios' | 'otros'
  //
  // Usa exactamente el mismo ProductListComponent, pero este interpreta
  // el slug y filtra la categoría automáticamente.
  //
  // Ejemplo:
  // /productos/categoria/guitarras
  // → ProductListComponent obtiene "guitarras" desde ActivatedRoute
  //   y aplica filtro inicial.
  // ============================================================
  {
    path: 'categoria/:slug',
    loadComponent: () =>
      import('./product-list/product-list').then(
        m => m.ProductListComponent
      ),
    data: {
      breadcrumb: 'Categoría',
    },
  },

  // ============================================================
  // DETALLE DE PRODUCTO
  // /productos/:slug
  //
  // - slug identifica un producto único y legible (Ej: "fender-player-telecaster")
  // - ProductDetailComponent resuelve el slug, obtiene el producto y renderiza
  //   características, imágenes, descripción, estado, precio, etc.
  //
  // Si el slug no existe, el componente debería manejar redirección a /not-found.
  // ============================================================
  {
    path: ':slug',
    loadComponent: () =>
      import('./product-detail/product-detail').then(
        m => m.ProductDetailComponent
      ),
    data: {
      breadcrumb: 'Detalle del producto',
    },
  },
];
