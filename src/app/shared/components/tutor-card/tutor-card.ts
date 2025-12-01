// ============================================================================
// TUTOR CARD COMPONENT
// ----------------------------------------------------------------------------
// Componente reutilizable que muestra un tutor en formato “card”.
// Se usa en:
//   • el GRID (tutores-list)
//   • el CAROUSEL (home, secciones destacadas)
//   • cualquier otro contenedor que requiera una card de tutor.
//
// Este componente NO maneja lógica de negocio. Sólo pinta datos.
// La lógica de filtrado, búsqueda o agrupación viene desde el exterior.
// ============================================================================

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Tutor } from '@core/models/tutor.model';
import { TruncatePipe } from '@shared/pipes/truncate-pipe';

// Tipos de presentación visual:
//  - "grid": card con más texto (tutores-list)
//  - "carousel": card compacta usada dentro del carrusel
export type TutorCardVariant = 'carousel' | 'grid';

@Component({
  selector: 'app-tutor-card',
  standalone: true,
  imports: [CommonModule, RouterLink, TruncatePipe],
  templateUrl: './tutor-card.html',
  styleUrls: ['./tutor-card.css'],
})
export class TutorCardComponent {

  // --------------------------------------------------------------------------
  // Datos del tutor (obligatorio)
  // --------------------------------------------------------------------------
  // El componente espera siempre un modelo Tutor completo.
  // La validación { required: true } no es necesaria porque el servicio
  // garantiza que los datos existen antes de llegar aquí.
  @Input() tutor!: Tutor;

  // --------------------------------------------------------------------------
  // Variante visual de la card
  // --------------------------------------------------------------------------
  // Elegimos entre:
  //   • 'grid' → card más grande (lista de tutores)
  //   • 'carousel' → card compacta dentro del carrusel
  //
  // Permite reutilizar el mismo componente con dos diseños distintos.
  // El HTML ya usa esta variable para aplicar clases condicionales.
  @Input() variant: TutorCardVariant = 'grid';

  // --------------------------------------------------------------------------
  // Mostrar / ocultar descripción breve
  // --------------------------------------------------------------------------
  // En el carrusel generalmente se muestra menos información.
  // En el grid queremos mostrar la descripción completa o truncada.
  @Input() showDescription = true;

  // --------------------------------------------------------------------------
  // Límite de caracteres para la descripción
  // --------------------------------------------------------------------------
  // Si la descripción es demasiado larga, se usa el pipe TruncatePipe
  // para cortar el texto de forma elegante (terminando en “…”).
  @Input() descriptionMaxLength = 120;
}
