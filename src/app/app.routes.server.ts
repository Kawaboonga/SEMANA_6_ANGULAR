/*import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];*/


import { RenderMode, PrerenderFallback, ServerRoute } from '@angular/ssr';

// Si quieres, cambia estas listas por lectura desde un JSON o servicio en build-time.
const SLUGS_PRODUCTOS = [
  'fender-stratocaster',
  'ibanez-rg',
  'boss-overdrive-od3',
];
const IDS_TUTORES = ['1', '2', '3'];

export const serverRoutes: ServerRoute[] = [
  // Rutas estáticas que quieres prerender (ejemplos):
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'home', renderMode: RenderMode.Prerender },
  { path: 'productos', renderMode: RenderMode.Prerender },
  { path: 'tutores', renderMode: RenderMode.Prerender },
  { path: 'cursos', renderMode: RenderMode.Prerender },
  { path: 'servicios', renderMode: RenderMode.Prerender },
  { path: 'somos', renderMode: RenderMode.Prerender },
  { path: 'contacto', renderMode: RenderMode.Prerender },
  { path: 'login', renderMode: RenderMode.Prerender },
  { path: 'register', renderMode: RenderMode.Prerender },
  { path: 'recover', renderMode: RenderMode.Prerender },
  { path: 'publicar', renderMode: RenderMode.Prerender },

  // RUTA DINÁMICA 1: producto/:slug
  {
    path: 'producto/:slug',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Server, // Si llega un slug no prerenderizado, cae a SSR on-the-fly
    async getPrerenderParams() {
      // Devuelve [{ slug: '...' }, ...]
      return SLUGS_PRODUCTOS.map((slug) => ({ slug }));
    },
  },

  // RUTA DINÁMICA 2: tutor/:id
  {
    path: 'tutor/:id',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Server,
    async getPrerenderParams() {
      // Devuelve [{ id: '1' }, { id: '2' }, ...]
      return IDS_TUTORES.map((id) => ({ id }));
    },
  },

  // Catch-all: todo lo demás en SSR
  { path: '**', renderMode: RenderMode.Server },
];

