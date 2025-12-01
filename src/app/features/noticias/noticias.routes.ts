import { Routes } from '@angular/router';

export const NOTICIAS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./noticias').then(m => m.Noticias),   // noticias.ts / class Noticias
    data: { breadcrumb: 'Noticias' },
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./noticias-detail/noticias-detail').then(m => m.NoticiaDetalle),
    data: { breadcrumb: 'Detalle' },
  },
];
