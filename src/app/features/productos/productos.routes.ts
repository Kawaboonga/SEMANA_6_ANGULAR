// ============================================================
// src/app/features/productos/productos.routes.ts
//
// Rutas del módulo de Productos (standalone).
// Se utilizan lazy-loaded components para optimizar el bundle.
// Cada ruta incluye su etiqueta para breadcrumbs.
// ============================================================

import { Routes } from '@angular/router';

export const PRODUCT_ROUTES: Routes = [

  // ============================================================
  // LISTADO DE PRODUCTOS (TODOS)
  // /productos
  // Carga la vista principal con el grid de productos sin filtrar.
  // ============================================================
  {
    path: '',
    loadComponent: () =>
      import('./product-list/product-list')
        .then(m => m.ProductListComponent),
    data: { breadcrumb: 'Productos' },
  },

  // ============================================================
  // LISTADO POR CATEGORÍA
  // /productos/categoria/:slug
  //
  // - slug coincide con ProductCategory:
  //   'guitarras' | 'bajos' | 'pedales' | 'amplificadores' | 'accesorios' | 'otros'
  // - Usa el mismo ProductListComponent pero filtrando por categoría.
  // ============================================================
  {
    path: 'categoria/:slug',
    loadComponent: () =>
      import('./product-list/product-list')
        .then(m => m.ProductListComponent),
    data: { breadcrumb: 'Categoría' },
  },

  // ============================================================
  // DETALLE DE UN PRODUCTO
  // /productos/:slug
  //
  // - El slug identifica un producto de manera legible para el usuario
  // - La vista muestra la información completa del producto
  // - Si el slug no existe, el component debería redirigir a not-found
  // ============================================================
  {
    path: ':slug',
    loadComponent: () =>
      import('./product-detail/product-detail')
        .then(m => m.ProductDetailComponent),
    data: { breadcrumb: 'Detalle del producto' },
  },
];
