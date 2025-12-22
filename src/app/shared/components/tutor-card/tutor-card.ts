// ============================================================================
//  TUTOR CARD COMPONENT (STANDALONE)
// ----------------------------------------------------------------------------
//  Componente reusable para mostrar información resumida de un tutor.
//  Presenta avatar, nombre, instrumentos, estilos, comuna y descripción.
//
//  Se usa en:
//    • Grid principal de /tutores
//    • Carrusel de tutores en Home
//    • Secciones destacadas u otros listados.
//
//  Este componente NO ejecuta lógica de negocio.
//  Sólo renderiza datos recibidos vía @Input().
// ============================================================================

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Tutor } from '@core/models/tutor.model';
import { TruncatePipe } from '@shared/pipes/truncate-pipe';

// Variantes visuales permitidas
export type TutorCardVariant = 'carousel' | 'grid';

/**
 * @component TutorCardComponent
 *
 * @description
 * Representa una tarjeta visual (card) para mostrar información
 * resumida de un tutor.  
 *  
 * El componente soporta dos variantes:
 * - `"grid"`: tamaño estándar, usada en el listado completo.
 * - `"carousel"`: tamaño reducido, usada en carruseles.
 *
 * También permite controlar si se muestra o no la descripción,
 * además de la longitud máxima de esta.
 *
 * Además, tal como en ProductCard / CourseCard:
 * - Puede mostrar botones de administración (Editar / Eliminar)
 *   si el contenedor lo solicita con `[canEdit]="true"`.
 * - Emite eventos hacia el padre (editRequest / deleteRequest)
 *   para que el componente contenedor haga el CRUD con TutorService.
 *
 * @usageNotes
 * Se inserta directamente en el template:
 *
 * ```html
 * <app-tutor-card
 *   [tutor]="t"
 *   variant="grid"
 * ></app-tutor-card>
 * ```
 *
 * @example
 * <!-- Ejemplo dentro del grid de tutores -->
 * <app-tutor-card
 *   *ngFor="let t of tutors"
 *   [tutor]="t"
 *   variant="grid"
 *   [showDescription]="true"
 *   [descriptionMaxLength]="140"
 * ></app-tutor-card>
 *
 * @example
 * <!-- Ejemplo dentro de un carrusel -->
 * <app-tutor-card
 *   [tutor]="tutor"
 *   variant="carousel"
 *   [showDescription]="false"
 * ></app-tutor-card>
 */
@Component({
  selector: 'app-tutor-card',
  standalone: true,
  imports: [CommonModule, RouterLink, TruncatePipe],
  templateUrl: './tutor-card.html',
  styleUrls: ['./tutor-card.css'],
})
export class TutorCardComponent {

  /**
   * Datos completos del tutor.
   *
   * @param tutor Modelo de tipo `Tutor` obligatorio.
   *
   * @example
   * <app-tutor-card [tutor]="item"></app-tutor-card>
   */
  @Input() tutor!: Tutor;

  /**
   * Variante visual de la tarjeta.
   *
   * @description
   * Permite cambiar entre dos estilos predefinidos:
   * - `"grid"`: tarjeta completa.
   * - `"carousel"`: tarjeta compacta.
   *
   * @default 'grid'
   *
   * @param variant Tipo `TutorCardVariant`
   */
  @Input() variant: TutorCardVariant = 'grid';

  /**
   * Controla si se muestra la descripción breve.
   *
   * @description
   * Normalmente `true` en la vista de grid y `false`
   * en la vista de carrusel.
   *
   * @default true
   *
   * @param showDescription boolean
   */
  @Input() showDescription = true;

  /**
   * Límite de caracteres usados por el `TruncatePipe`.
   *
   * @description
   * La descripción del tutor se recorta automáticamente si supera
   * este límite.
   *
   * @default 120
   *
   * @param descriptionMaxLength número máximo de caracteres
   */
  @Input() descriptionMaxLength = 120;

  // ==========================================================================
  // MODO ADMIN (igual patrón que productos / cursos)
  // ==========================================================================

  /**
   * @description
   * Si es `true`, la card muestra acciones de administración.
   * Normalmente se enlaza a algo como `isAdmin()` en el componente padre.
   */
  @Input() canEdit = false;

  /**
   * @description
   * Solicita al componente padre abrir el formulario de edición.
   * Payload: `id` del tutor.
   */
  @Output() editRequest = new EventEmitter<string>();

  /**
   * @description
   * Solicita al componente padre eliminar el tutor.
   * Payload: `id` del tutor.
   */
  @Output() deleteRequest = new EventEmitter<string>();

  /**
   * @description
   * Click del botón editar.
   *
   * @important
   * - Se hace stopPropagation + preventDefault porque esta card tiene links
   *   (CTA "Ver perfil") y no queremos navegar cuando el admin edita.
   */
  onEditClick(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    this.editRequest.emit(this.tutor.id);
  }

  /**
   * @description
   * Click del botón eliminar.
   * - Confirma con `confirm()` (mismo estándar de productos/cursos).
   */
  onDeleteClick(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();

    const ok = confirm(
      `¿Eliminar el tutor "${this.tutor.name}"?\n` +
        'Esta acción no se puede deshacer.',
    );

    if (!ok) return;

    this.deleteRequest.emit(this.tutor.id);
  }
}
