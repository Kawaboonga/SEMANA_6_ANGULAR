import {
  Component,
  OnDestroy,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { filter, Subscription } from 'rxjs';

import { ServiceService } from '@core/services/service.service';
import { NewsService } from '@core/services/news.service';
import { CourseService } from '@core/services/course.service';
import { ProductService } from '@core/services/product.service';

/**
 * Modelo de una miga de pan (breadcrumb)
 * label → texto visible
 * url   → ruta a la que navega
 */
interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  templateUrl: './breadcrumb.html',
  styleUrls: ['./breadcrumb.css'],
  imports: [NgFor, NgIf, RouterLink],
})
export class BreadcrumbComponent implements OnDestroy {
  /** Arreglo que se muestra en el template como "Inicio / Sección / Detalle" */
  breadcrumbs: Breadcrumb[] = [];

  /** Referencia al <ol> para aplicarle la animación de fade */
  @ViewChild('bcRef') breadcrumbEl?: ElementRef<HTMLOListElement>;

  /** Suscripción a los eventos del router (para limpiarla luego) */
  private sub?: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private serviceService: ServiceService,
    private newsService: NewsService,
    private courseService: CourseService,
    private productService: ProductService
  ) {
    // Nos suscribimos a NavigationEnd para actualizar el breadcrumb
    this.sub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.triggerFade();
      });
  }

  /**
   * Aplica una pequeña animación de fade-out/fade-in al cambiar de ruta
   * y reconstruye el arreglo de breadcrumbs.
   */
  private triggerFade(): void {
    const el = this.breadcrumbEl?.nativeElement;

    // Si estamos en /admin o alguna subruta → no mostramos breadcrumb
    if (this.router.url.startsWith('/admin')) {
      this.breadcrumbs = [];
      return;
    }

    // Primera carga o todavía no hay referencia al <ol>
    if (!el) {
      this.breadcrumbs = this.buildBreadcrumbs(this.route.root);
      return;
    }

    // 1) Fade-out
    el.classList.add('fade-out');

    // 2) Actualizamos contenido y luego disparamos fade-in
    setTimeout(() => {
      this.breadcrumbs = this.buildBreadcrumbs(this.route.root);

      // Forzamos reflow por seguridad
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      el.offsetHeight;

      // 3) Fade-in (quitando la clase)
      el.classList.remove('fade-out');
    }, 80);
  }

  /**
   * Recorre recursivamente el árbol de rutas activas y arma las migas.
   *
   * @param route       Ruta actual
   * @param url         URL acumulada
   * @param breadcrumbs Arreglo acumulado
   */
  private buildBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    const children = route.children;

    // Caso base: no hay más hijos
    if (!children || children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeConfig = child.snapshot.routeConfig;
      if (!routeConfig) continue;

      // Segmento de esta ruta (ej: 'noticias', ':id', 'cursos', etc.)
      const routeURL = child.snapshot.url.map(seg => seg.path).join('/');
      const nextUrl = routeURL ? `${url}/${routeURL}` : url;

      // Label base desde data.breadcrumb (si existe)
      let label: string | undefined = child.snapshot.data['breadcrumb'];

      const parentPath = child.parent?.snapshot.routeConfig?.path;
      const currentPath = routeConfig.path;

      // ======================================================
      // 🔵 SERVICIOS → /servicios/:slug
      // ======================================================
      if (parentPath === 'servicios' && currentPath === ':slug') {
        const slug = child.snapshot.params['slug'];
        const service = this.serviceService.getBySlug(slug);

        if (service) {
          label = service.name;
        } else if (!label) {
          label = 'Servicio';
        }
      }

      // ======================================================
      // 🟣 NOTICIAS → /noticias/:id
      // ======================================================
      if (parentPath === 'noticias' && currentPath === ':id') {
        const id = child.snapshot.params['id'];
        const noticia = this.newsService.getById(id);

        // Aseguramos la miga intermedia "Noticias"
        const noticiasCrumbExists = breadcrumbs.some(
          b => b.label === 'Noticias' && b.url === '/noticias'
        );
        if (!noticiasCrumbExists) {
          breadcrumbs.push({
            label: 'Noticias',
            url: '/noticias',
          });
        }

        // Última miga: título de la noticia
        if (noticia) {
          label = noticia.title;
        } else if (!label) {
          label = 'Noticia';
        }
      }

      // ======================================================
      // 🟠 CURSOS → /cursos/:slug
      // ======================================================
      if (
        currentPath === 'cursos/:slug' ||
        (parentPath === 'cursos' && currentPath === ':slug')
      ) {
        const slug = child.snapshot.params['slug'];
        const course = this.courseService.getCourseBySlug(slug);

        // Miga intermedia "Cursos"
        const cursosCrumbExists = breadcrumbs.some(
          b => b.label === 'Cursos' && b.url === '/cursos'
        );
        if (!cursosCrumbExists) {
          breadcrumbs.push({
            label: 'Cursos',
            url: '/cursos',
          });
        }

        // Miga final con título del curso
        if (course) {
          label = course.title;
        } else if (!label) {
          label = 'Curso';
        }
      }

      // ======================================================
      // 🟢 PRODUCTOS → /productos y /productos/:slug
      // ======================================================

      // Siempre aseguramos miga "Productos" cuando estamos en esa sección
      if (currentPath === 'productos' || parentPath === 'productos') {
        const productosCrumbExists = breadcrumbs.some(
          b => b.label === 'Productos' && b.url === '/productos'
        );
        if (!productosCrumbExists) {
          breadcrumbs.push({
            label: 'Productos',
            url: '/productos',
          });
        }
      }

      // Detalle de producto: /productos/:slug o /productos/:id
      if (
        parentPath === 'productos' &&
        (currentPath === ':slug' || currentPath === ':id')
      ) {
        const slugOrId =
          child.snapshot.params['slug'] ?? child.snapshot.params['id'];

        let product: any | undefined;
        if (slugOrId) {
          product = this.productService.getBySlug(slugOrId);
        }

        if (product) {
          label = product.name ?? product.title ?? 'Producto';
        } else if (!label) {
          label = 'Producto';
        }
      }

      // ======================================================
      // Agregamos la miga si hay label
      // ======================================================
      if (label) {
        const exists = breadcrumbs.some(
          b => b.label === label && b.url === (nextUrl || '/')
        );

        if (!exists) {
          breadcrumbs.push({
            label,
            url: nextUrl || '/',
          });
        }
      }

      // Recorremos recursivamente el resto del árbol
      this.buildBreadcrumbs(child, nextUrl, breadcrumbs);
    }

    return breadcrumbs;
  }

  /** Limpiamos la suscripción al destruir el componente */
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
