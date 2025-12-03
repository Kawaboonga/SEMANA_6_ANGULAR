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

import { Component, Input } from '@angular/core';
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
}
