
import { Routes } from '@angular/router';

/**
 * Rutas del módulo "Noticias".
 *
 * Este archivo define la navegación completa del feature:
 * - Listado general de noticias.
 * - Página de detalle para una noticia específica.
 *
 * Ambas rutas cargan componentes standalone de forma Lazy,
 * permitiendo un feature separado, liviano y sin necesidad de módulos.
 *
 * @usageNotes
 * - `breadcrumb` es leído por tu componente global de migas.
 * - Para SEO / SSR más adelante, este patrón funciona perfecto.
 * - La ruta `:id` espera un identificador único de la noticia.
 */
export const NOTICIAS_ROUTES: Routes = [
  {
    /**
     * Ruta raíz del feature.
     *
     * /noticias
     * → Renderiza el listado general usando el componente `<app-noticias>`.
     *
     * Se carga lazy usando loadComponent, por lo que solo se descarga
     * cuando el usuario entra a esta sección.
     */
    path: '',
    loadComponent: () =>
      import('./noticias').then(m => m.Noticias), // noticias.ts → class Noticias
    data: {
      breadcrumb: 'Noticias', // Título del breadcrumb para esta vista
    },
  },

  {
    /**
     * Ruta de detalle.
     *
     * /noticias/:id
     * → Carga la vista de detalle de una noticia específica.
     *
     * El parámetro dinámico :id es consumido en noticias-detail.ts,
     * donde se consulta NewsService.getById().
     */
    path: ':id',
    loadComponent: () =>
      import('./noticias-detail/noticias-detail').then(
        m => m.NoticiaDetalle,
      ),
    data: {
      breadcrumb: 'Detalle', // Segunda miga de pan cuando ingresas al detalle
    },
  },
];
