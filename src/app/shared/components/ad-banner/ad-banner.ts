import { Component } from '@angular/core';

/**
 * Componente: AdBanner
 * ---------------------------------------------------------------------------
 * Banner publicitario reutilizable.
 *
 * @description
 * Este componente representa un bloque simple de banner publicitario o
 * promocional. Está construido como **standalone**, por lo que puede
 * insertarse en cualquier parte de tu aplicación sin depender de módulos.
 *
 * En su estado actual, es un componente **visual y estático**, pero está
 * preparado para crecer fácilmente con propiedades Input para:
 * - título
 * - imagen
 * - enlace
 * - variantes de estilo
 *
 * @usageNotes
 * Se puede insertar directamente en cualquier template:
 *
 * ```html
 * <app-ad-banner></app-ad-banner>
 * ```
 *
 * Si en el futuro agregas @Input(), podrás usarlo así:
 * ```html
 * <app-ad-banner
 *   [title]="'Aprende guitarra en 8 semanas'"
 *   [imageUrl]="'/assets/banners/guitarra.jpg'"
 *   [link]="'/cursos/guitarra'"
 * ></app-ad-banner>
 * ```
 *
 * @example
 * <!-- Ejemplo básico de uso -->
 * <section>
 *   <app-ad-banner></app-ad-banner>
 * </section>
 */
@Component({
  selector: 'app-ad-banner',
  standalone: true,
  /**
   * @description
   * Actualmente no usa otros componentes o directivas.
   * Puedes agregar más imports según crezca la funcionalidad.
   */
  imports: [],
  templateUrl: './ad-banner.html',
  styleUrl: './ad-banner.css',
})
export class AdBanner {
  /**
   * Lógica del componente.
   *
   * @description
   * Por ahora está vacío porque el banner es estático.
   * Puedes agregar @Input() en cuanto necesites que sea dinámico.
   *
   * @example
   * @Input() title = '';
   * @Input() imageUrl = '';
   * @Input() link = '';
   */
  constructor() {}
}
