import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Course } from '@core/models/course.model';

/**
 * ========================================================================
 * COURSE CARD COMPONENT
 * ========================================================================
 * @description
 * Componente visual reutilizable para renderizar una tarjeta de curso.
 * Está diseñado como **dumb component**, lo que significa:
 *
 *  ✔ No contiene lógica de negocio  
 *  ✔ No consulta servicios  
 *  ✔ No filtra ni ordena  
 *  ✔ Solo recibe un `Course` y lo muestra
 *
 * Esto permite reutilizar la misma tarjeta en:
 *  - grids de cursos
 *  - Sección “Más cursos del tutor”
 *  - carouseles del home
 *  - resultados de búsqueda
 *  - módulos futuros sin duplicar HTML
 *
 * @usageNotes
 * Importar en cualquier vista standalone:
 * ```ts
 * imports: [CourseCardComponent]
 * ```
 *
 * En un template:
 * ```html
 * <app-course-card [course]="curso"></app-course-card>
 * ```
 *
 * @example
 * ```html
 * <app-course-card
 *      [course]="{
 *        id: 'guitarra-basica',
 *        title: 'Guitarra Básica',
 *        difficulty: 'Principiante',
 *        duration: '12 h · 6 clases',
 *        modalities: ['Online'],
 *        priceCLP: 19900
 *      }"
 * ></app-course-card>
 * ```
 */
@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './course-card.html',
  styleUrls: ['./course-card.css'],
})
export class CourseCardComponent {

  /**
   * @description
   * Modelo completo del curso que se desea mostrar.
   *  
   * **required: true** → evita que se renderice sin datos válidos.
   *
   * @param course - Objeto `Course` con toda la información del curso.
   */
  @Input({ required: true }) course!: Course;


  // ------------------------------------------------------------------------
  // GETTERS DERIVADOS (presentación)
  // ------------------------------------------------------------------------

  /**
   * @description
   * Construye la meta-información del curso:  
   * `"Intermedio · 16 h · 8 clases"`
   *
   * @return string — Cadena lista para mostrarse en la card.
   */
  get meta(): string {
    return `${this.course.difficulty} · ${this.course.duration}`;
  }

  /**
   * @description
   * Devuelve la lista de modalidades como texto simple.
   *
   * Ejemplo:
   * ```
   * ['Presencial', 'Online'] → "Presencial,Online"
   * ```
   *
   * @return string — Modalidades unidas para uso en texto o tooltip.
   *
   * @usageNotes
   * Puedes reemplazarlo por íconos más adelante sin romper el API.
   */
  get mod(): string {
    return `${this.course.modalities}`;
  }

  /**
   * @description
   * Formatea el precio del curso en pesos chilenos (CLP).
   *
   * @return string — Precio formateado, ej: `$25.000`.
   *
   * @example
   * ```ts
   * priceLabel → "$89.990"
   * ```
   */
  get priceLabel(): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    }).format(this.course.priceCLP);
  }
}
