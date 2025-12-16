import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // ====== Estáticas (prerender) ======
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

  // ====== Dinámicas (SSR) ======
  { path: 'tutores/:id', renderMode: RenderMode.Server },
  { path: 'cursos/:slug', renderMode: RenderMode.Server },
  { path: 'productos/categoria/:slug', renderMode: RenderMode.Server },
  { path: 'servicios/:slug', renderMode: RenderMode.Server },
  { path: 'noticias/:id', renderMode: RenderMode.Server },

  // Catch-all
  { path: '**', renderMode: RenderMode.Server },
];
