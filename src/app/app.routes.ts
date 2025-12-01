// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { MainLayout } from '@core/layouts/main-layout/main-layout';

// ⚠️ OJO: asegúrate que estos paths coincidan con los nombres de archivo reales.
// Si creaste `auth.guard.ts`, el import debería ser '@core/guards/auth.guard'.
import { authGuard } from '@core/guards/auth-guard';
import { adminGuard } from '@core/guards/admin-guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [

      // ================================
      // RUTAS PÚBLICAS
      // ================================

      // Home
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('@features/home/home').then(m => m.Home),
        data: { breadcrumb: 'Inicio' },
      },

      {
        path: 'home',
        redirectTo: '',
        pathMatch: 'full',
      },

      {
        path: 'somos',
        loadComponent: () =>
          import('@features/somos/somos').then(m => m.Somos),
        data: { breadcrumb: 'Quiénes somos' },
      },

      {
        path: 'tutores',
        loadChildren: () =>
          import('@features/tutores/tutores.routes').then(m => m.TUTORES_ROUTES),
        data: { breadcrumb: 'Tutores' },
      },

      {
        path: 'cursos',
        loadComponent: () =>
          import('@features/cursos/cursos-list/cursos-list').then(
            m => m.CursosListComponent
          ),
        data: { breadcrumb: 'Cursos' },
      },

      {
        path: 'cursos/:slug',
        loadComponent: () =>
          import('@features/cursos/curso-detail/curso-detail').then(
            m => m.CursoDetailComponent
          ),
        data: { breadcrumb: 'Curso' }, // el breadcrumb dinámico lo puedes sobreescribir en el componente
      },

      {
        path: 'productos',
        loadChildren: () =>
          import('@features/productos/productos.routes').then(m => m.PRODUCT_ROUTES),
        data: { breadcrumb: 'Productos' },
      },

      {
        path: 'servicios',
        loadChildren: () =>
          import('@features/servicios/servicios.routes').then(m => m.SERVICIOS_ROUTES),
        data: { breadcrumb: 'Servicios' },
      },

      {
        path: 'noticias',
        loadChildren: () =>
          import('@features/noticias/noticias.routes').then(m => m.NOTICIAS_ROUTES),
        // si quieres que el breadcrumb diga "Noticias":
        // data: { breadcrumb: 'Noticias' },
      },

      {
        path: 'contacto',
        loadComponent: () =>
          import('@features/contacto/contacto').then(m => m.Contacto),
        data: { breadcrumb: 'Contacto' },
      },

      // ================================
      // AUTENTICACIÓN
      // ================================
      {
        path: 'auth',
        children: [
          {
            path: 'login',
            loadComponent: () =>
              import('@features/auth/login/login').then(m => m.LoginComponent),
            data: { breadcrumb: 'Iniciar sesión' },
          },
          {
            path: 'register',
            loadComponent: () =>
              import('@features/auth/register/register').then(m => m.RegisterComponent),
            data: { breadcrumb: 'Registro' },
          },
          {
            path: 'recover-password',
            loadComponent: () =>
              import('@features/auth/recover/recover').then(m => m.Recover),
            data: { breadcrumb: 'Recuperar contraseña' },
          },
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'login',
          },
        ],
      },

      // ================================
      // PERFIL (PROTEGIDO)
      // ================================
      {
        path: 'mi-cuenta',
        canActivate: [authGuard],
        loadComponent: () =>
          import('@features/auth/profile/profile').then(m => m.Profile),
        data: { breadcrumb: 'Mi cuenta' },
      },

      // ================================
      // ADMIN (PROTEGIDO: LOGIN + ROL ADMIN)
      // ================================
      {
        path: 'admin',
        canActivate: [authGuard, adminGuard],
        loadComponent: () =>
          import('@features/admin/admin-layout/admin-layout').then(m => m.AdminLayout),
        children: [
          {
            path: '',
            pathMatch: 'full',
            loadComponent: () =>
              import('@features/admin/admin-dashboard/admin-dashboard').then(
                m => m.AdminDashboard
              ),
          },
          {
            path: 'tutores',
            loadComponent: () =>
              import('@features/admin/admin-tutores/admin-tutores').then(
                m => m.AdminTutores
              ),
          },
          {
            path: 'productos',
            loadComponent: () =>
              import('@features/admin/admin-productos/admin-productos').then(
                m => m.AdminProductos
              ),
          },
          {
            path: 'cursos',
            loadComponent: () =>
              import('@features/admin/admin-cursos/admin-cursos').then(
                m => m.AdminCursosComponent
              ),
          },
          {
            path: 'usuarios',
            loadComponent: () =>
              import('@features/admin/admin-usuarios/admin-usuarios').then(
                m => m.AdminUsuarios
              ),
          },
        ],
      },
    ],
  },

  // ================================
  // RUTA DESCONOCIDA → HOME
  // ================================
  {
    path: '**',
    redirectTo: '',
  },
];
