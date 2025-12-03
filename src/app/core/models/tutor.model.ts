// src/app/core/models/tutor.ts

/**
 * Tipos base para instrumentos, estilos, niveles y modalidades del tutor.
 *
 * Están definidos como `string` por flexibilidad mientras el proyecto está en desarrollo.
 * Más adelante, si necesitas validaciones más estrictas, estos mismos tipos pueden
 * convertirse en union types como:
 *
 * `export type TutorInstrument = 'guitarra' | 'bajo' | 'voz';`
 *
 * @usageNotes
 * - Mantenerlos como string permite extender el catálogo sin romper nada.
 * - Ideal para prototipado y para catálogos grandes.
 */
export type TutorInstrument = string;
export type TutorStyle = string;
export type TutorLevel = string;
export type TutorModality = string;

/**
 * Representa un bloque de disponibilidad semanal del tutor.
 * Indica qué días trabaja y en qué horarios se puede agendar.
 *
 * Usado en:  
 * - ficha del tutor  
 * - buscadores de horarios  
 * - administración de agenda (futuro)
 *
 * @example
 * const slot: WeeklySlot = {
 *   day: 'Lun',
 *   times: ['18:00', '19:30']
 * };
 */
export interface WeeklySlot {
  day: string;
  times: string[];
}

/**
 * Referencia mínima a un curso impartido por el tutor.
 *
 * Sirve para mostrar una lista simple sin cargar el curso completo.
 * Muy útil en cards, vistas rápidas y secciones del perfil del tutor.
 *
 * @usageNotes
 * - `slug` es opcional porque algunos cursos del mock aún no lo tienen definido.
 */
export interface TutorCourseRef {
  id: string;
  title: string;
  slug?: string;
}

/**
 * Representa una reseña escrita por un alumno.
 *
 * Las reviews ayudan a dar contexto real: confianza, experiencia previa,
 * claridad en las clases y satisfacción general.
 *
 * @example
 * const review: TutorReview = {
 *   author: 'Juan',
 *   rating: 5,
 *   comment: 'Excelente profesor',
 *   createdAt: '2024-06-10'
 * };
 */
export interface TutorReview {
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
}

/**
 * Información del equipamiento usado por el tutor.
 *
 * Estos datos se usan en la sección “Gear” dentro de la ficha del tutor,
 * entregando un toque más personal y mostrando la afinidad sonora del profesor.
 *
 * @usageNotes
 * - `reason` permite explicar por qué el equipo es importante para sus clases.
 * - `imageUrl` es opcional: no todos los equipos requieren foto.
 */
export interface TutorGearItem {
  name: string;
  description: string;
  reason?: string;
  imageUrl?: string;
}

/**
 * Modelo principal del tutor dentro del proyecto.
 *
 * Este modelo alimenta toda la lógica relacionada a:
 * - búsqueda de tutores por instrumento, estilo o nivel  
 * - card de listado  
 * - ficha completa del tutor  
 * - cursos asociados  
 * - disponibilidad y horas  
 * - calificaciones, idioma, experiencia y educación  
 * - sección de equipo personal  
 *
 * Es uno de los modelos más completos del proyecto porque representa
 * a un profesor real con datos útiles para los alumnos.
 *
 * @usageNotes
 * - Si agregas nuevos campos (ej: redes sociales, video, badges), deben incorporarse aquí.
 * - Mantén consistencia en `instruments`, `styles` y `modalities` para mejorar filtros.
 * - Todas las fechas están en string para no forzar formateos en esta capa.
 *
 * @example
 * const tutor: Tutor = {
 *   id: 'marco-vidal',
 *   name: 'Marco Vidal',
 *   avatarUrl: '/img/marco.jpg',
 *   instruments: ['guitarra-electrica'],
 *   styles: ['rock'],
 *   levelRange: ['principiante', 'intermedio'],
 *   modalities: ['online'],
 *   shortDescription: 'Clases centradas en repertorio real.',
 *   fullDescription: 'Texto completo...',
 *   city: 'Santiago',
 *   commune: 'Providencia',
 *   hourlyRate: 25000,
 *   rating: 4.7,
 *   ratingCount: 24,
 *   languages: ['Español'],
 *   experience: '8 años de docencia',
 *   education: 'Projazz',
 *   weeklyAvailability: [],
 *   courses: [],
 *   reviews: [],
 *   gear: []
 * };
 */

// Modelo principal del tutor.
// Este es el que utiliza todo el proyecto tanto en curso, detalle, cards, admin, etc.
export interface Tutor {
  id: string;                // identificador único del tutor
  name: string;              // nombre completo
  avatarUrl: string;         // foto de perfil

  // Categorías importantes asociadas al tutor.
  instruments: TutorInstrument[];
  styles: TutorStyle[];
  levelRange: TutorLevel[];
  modalities: TutorModality[];

  shortDescription: string;  // resumen para cards, listado, etc.
  fullDescription: string;   // descripción completa para la página de detalle

  city: string;              // ciudad donde realiza clases
  commune: string;           // comuna específica (útil para clases presenciales)

  hourlyRate: number;        // precio por hora

  rating: number;            // nota promedio basada en reviews
  ratingCount: number;       // cantidad de evaluaciones

  languages: string[];       // idiomas que habla (útil para alumnos extranjeros)
  experience: string;        // experiencia del tutor
  education: string;         // estudios o certificaciones

  weeklyAvailability: WeeklySlot[];  // días y horarios disponibles

  courses: TutorCourseRef[];         // cursos que enseña
  reviews: TutorReview[];            // lista de reseñas de alumnos
  gear: TutorGearItem[];             // equipamiento destacado
}
