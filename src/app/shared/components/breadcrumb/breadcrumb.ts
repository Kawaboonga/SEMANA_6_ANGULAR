import { Component, OnDestroy, ElementRef, ViewChild,} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink,} from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { filter, Subscription } from 'rxjs';

import { ServiceService } from '@core/services/service.service';
import { NewsService } from '@core/services/news.service';
import { CourseService } from '@core/services/course.service';
import { ProductService } from '@core/services/product.service';

/**
 * Modelo de una miga de pan (breadcrumb).
 *
 * @description
 * Representa un ítem individual dentro del breadcrumb:
 * texto visible y URL asociada.
 *
 * @usageNotes
 * - `label` se muestra en la interfaz.
 * - `url` se usa para navegar al hacer clic.
 */
interface Breadcrumb {
  /** Texto visible del enlace en el breadcrumb */
  label: string;
  /** Ruta a la que navega al hacer clic */
  url: string;
}

/**
 * Componente responsable de construir y mostrar las migas de pan (breadcrumb).
 *
 * @description
 * Escucha los eventos de navegación del router y genera dinámicamente
 * el arreglo de breadcrumbs según las rutas activas. También:
 * - Resuelve labels dinámicos para servicios, noticias, cursos y productos.
 * - Aplica una animación ligera de fade al cambiar de ruta.
 *
 * @usageNotes
 * - No requiere configuración explícita en cada ruta, solo:
 *   - `data: { breadcrumb: 'Texto fijo' }` para labels estáticos.
 *   - El propio componente resuelve labels dinámicos según el contexto.
 * - Oculta el breadcrumb cuando la URL comienza con `/admin`.
 *
 * @example
 * <!-- En un layout principal (app-layout.html) -->
 * <header>
 *   <app-breadcrumb></app-breadcrumb>
 * </header>
 */
@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  templateUrl: './breadcrumb.html',
  styleUrls: ['./breadcrumb.css'],
  imports: [NgFor, NgIf, RouterLink],
})
export class BreadcrumbComponent implements OnDestroy {
  /**
   * Arreglo que se muestra en el template como:
   * "Inicio / Sección / Detalle".
   *
   * @description
   * Se actualiza en cada NavigationEnd mediante `triggerFade()`
   * y `buildBreadcrumbs()`.
   */
  breadcrumbs: Breadcrumb[] = [];

  /**
   * Referencia al `<ol>` del template.
   *
   * @description
   * Se utiliza para aplicar y quitar clases CSS de animación
   * (fade-out / fade-in) cuando cambia la ruta.
   */
  @ViewChild('bcRef') breadcrumbEl?: ElementRef<HTMLOListElement>;

  /**
   * Suscripción a los eventos del router.
   *
   * @description
   * Se guarda para poder limpiarla correctamente en `ngOnDestroy()`.
   */
  private sub?: Subscription;

  /**
   * Constructor del componente.
   *
   * @description
   * Inyecta Router, ActivatedRoute y los servicios de dominio
   * (servicios, noticias, cursos, productos). Además, se suscribe
   * a los eventos de `NavigationEnd` para reconstruir el breadcrumb
   * con animación en cada cambio de ruta.
   *
   * @param router         Router principal de Angular.
   * @param route          ActivatedRoute raíz desde donde se recorre el árbol.
   * @param serviceService Servicio que resuelve datos de "servicios".
   * @param newsService    Servicio que resuelve datos de "noticias".
   * @param courseService  Servicio que resuelve datos de "cursos".
   * @param productService Servicio que resuelve datos de "productos".
   *
   * @usageNotes
   * - La suscripción creada aquí se limpia en `ngOnDestroy()`.
   */
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private serviceService: ServiceService,
    private newsService: NewsService,
    private courseService: CourseService,
    private productService: ProductService
  ) {
    this.sub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.triggerFade();
      });
  }

  /**
   * Aplica una animación de fade-out / fade-in al `<ol>` del breadcrumb
   * y reconstruye el arreglo `breadcrumbs`.
   *
   * @description
   * - Si la ruta actual comienza con `/admin`, se limpia el breadcrumb.
   * - Si aún no existe la referencia al `<ol>`, solo reconstruye sin animación.
   * - De lo contrario:
   *   1. Aplica clase `fade-out`.
   *   2. Actualiza el contenido del breadcrumb.
   *   3. Fuerza un reflow y remueve `fade-out` para simular fade-in.
   *
   * @return {void}
   *
   * @usageNotes
   * - No debe llamarse manualmente; se invoca en cada `NavigationEnd`.
   *
   * @example
   * // Internamente, en la suscripción al router:
   * this.sub = this.router.events
   *   .pipe(filter(e => e instanceof NavigationEnd))
   *   .subscribe(() => this.triggerFade());
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
   * Recorre recursivamente el árbol de rutas activas y arma el arreglo de migas.
   *
   * @description
   * - Usa `route.children` para descender en el árbol.
   * - Construye la URL acumulada (`url` + segmentos actuales).
   * - Determina la etiqueta (`label`) según:
   *   - `data.breadcrumb` en las rutas.
   *   - Datos dinámicos para:
   *     - Servicios (nombre del servicio).
   *     - Noticias (título de la noticia + miga “Noticias”).
   *     - Cursos (título del curso + miga “Cursos”).
   *     - Productos (nombre del producto + miga “Productos”).
   *
   * @param {ActivatedRoute} route     Ruta actual desde donde se inicia el recorrido.
   * @param {string} [url='']          URL acumulada hasta el nodo actual.
   * @param {Breadcrumb[]} [breadcrumbs=[]] Arreglo acumulado de breadcrumbs.
   *
   * @return {Breadcrumb[]} Arreglo final de breadcrumbs listo para la vista.
   *
   * @usageNotes
   * - No se llama desde la plantilla, solo desde `triggerFade()`.
   * - Evita duplicar migas comprobando si ya existe una entrada con
   *   el mismo label y url.
   *
   * @example
   * const result = this.buildBreadcrumbs(this.route.root);
   * // result → [{ label: 'Inicio', url: '/' }, { label: 'Cursos', url: '/cursos' }, ...]
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

  /**
   * Lifecycle hook de destrucción del componente.
   *
   * @description
   * Cancela la suscripción a los eventos del router para evitar
   * fugas de memoria cuando el componente deja de estar en uso.
   *
   * @return {void}
   *
   * @example
   * ngOnDestroy(): void {
   *   this.sub?.unsubscribe();
   * }
   */
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
