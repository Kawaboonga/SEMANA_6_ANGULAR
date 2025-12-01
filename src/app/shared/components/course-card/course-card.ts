// src/app/shared/components/course-card/course-card.ts

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Course } from '@core/models/course.model';

/**
 * ============================================================
 *  COURSE CARD COMPONENT
 * ============================================================
 *
 *  Componente visual reutilizable para mostrar información
 *  resumida de un curso:
 *
 *    - imagen
 *    - nombre / título
 *    - dificultad + duración
 *    - modalidad
 *    - precio
 *
 *  Este componente es un “dumb component”:
 *    ✔ solo recibe un @Input()
 *    ✔ no contiene lógica de negocio
 *    ✔ no carga datos, no filtra, no consulta servicios
 *    ✔ se limita a representar visualmente un Course
 *
 *  Beneficio:
 *    → Permite que page-views, listas, carouseles y perfiles
 *      reutilicen exactamente la misma card sin duplicar HTML.
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
   * ============================================================
   *  INPUT PRINCIPAL
   * ============================================================
   *
   *  course → modelo completo de un curso.
   *  El decorador required: true exige que siempre se entregue.
   */
  @Input({ required: true }) course!: Course;

  /**
   * ============================================================
   *  META DEL CURSO (dificultad + duración)
   * ============================================================
   *
   * Ejemplo: "Intermedio · 16 h · 8 clases"
   *
   * Usado en la card bajo el título.
   */
  get meta(): string {
    return `${this.course.difficulty} · ${this.course.duration}`;
  }

  /**
   * ============================================================
   *  MODALIDADES (texto)
   * ============================================================
   *
   * El curso puede tener una o varias modalidades:
   *   ["Presencial", "Online"] → "Presencial,Online"
   *
   * Si en el futuro deseas íconos (walking/video), este getter
   * seguirá siendo útil como fallback o tooltip.
   */
  get mod(): string {
    return `${this.course.modalities}`;
  }

  /**
   * ============================================================
   *  PRECIO FORMATEADO
   * ============================================================
   *
   * Formatea el precio en CLP de forma consistente con toda la app:
   *
   *   25000 → "$25.000"
   *
   * Ideal para no repetir Intl.NumberFormat en múltiples templates.
   */
  get priceLabel(): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    }).format(this.course.priceCLP);
  }
}
