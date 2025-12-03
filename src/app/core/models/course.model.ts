
/**
 * Nivel de dificultad del curso.
 * Usado en listados, detalle y filtros.
 *
 * @usageNotes
 * - Mantén estos textos capitalizados porque se muestran en UI.
 * - Sirve también para búsquedas rápidas y agrupación.
 */
export type CourseDifficulty = 'Principiante' | 'Intermedio' | 'Avanzado';

/**
 * Modalidades posibles del curso.
 * Útiles para mostrar en UI con íconos (presencial, online, híbrido).
 */
export type CourseModality = 'Presencial' | 'Online' | 'Híbrido';

/**
 * Reseñas asociadas a un curso, muy similares al modelo de tutor.
 * Representan feedback real de alumnos.
 *
 * @usageNotes
 * - `createdAt` permite string o Date para mayor flexibilidad,
 *   especialmente en admin cuando se generan nuevas reseñas.
 */
export interface CourseReview {
  author: string;
  rating: number;
  comment: string;
  createdAt: string | Date;
}

/**
 * Modelo principal del curso.
 *
 * Este modelo se usa en:
 * - cards del home,
 * - listado de cursos,
 * - página de detalle,
 * - perfil del tutor,
 * - administración de cursos.
 *
 * Contiene información visual, descripciones, modalidades, relación con el tutor,
 * etapas del curso, aprendizajes esperados, ratings, precios y flags visuales.
 *
 * @usageNotes
 * - `level` se mantiene por compatibilidad aunque `difficulty` lo reemplaza.
 * - `duration` puede verse como texto amigable y `durationHours` como número real.
 * - `slug` es clave para rutas limpias en Angular.
 * - `modalities` se usan para mostrar íconos de modalidad.
 * - Flags como `isFeatured`, `isOffer` y `showInCarousel` controlan la UI del home.
 *
 * @example
 * const curso: Course = {
 *   id: 'curso-guitarra-rock',
 *   slug: 'guitarra-rock',
 *   title: 'Curso intensivo de guitarra rock',
 *   tutorId: 'marco-vidal',
 *   tutorName: 'Marco Vidal',
 *   modalities: ['Presencial', 'Online'],
 *   shortDescription: 'Domina riffs y técnica moderna.',
 *   description: 'Descripción completa...',
 *   stages: ['Power chords', 'Palm mute', 'Riffs'],
 *   learnOutcomes: ['Mejor timing', 'Dominio básico de riffs'],
 *   priceCLP: 89990,
 *   showInCarousel: true,
 *   isActive: true
 * };
 */
export interface Course {
  id: string;
  // ID único del curso.

  slug: string;
  // Slug para generar rutas limpias. Ej: /cursos/guitarra-rock.

  title: string;
  // Título visible en cards y detalle.

  tutorId: string;
  // Relación con el tutor principal del curso.

  tutorName: string;
  // Nombre duplicado para evitar hacer joins en el front.

  // ----- NIVEL -----
  difficulty?: CourseDifficulty;
  level?: CourseDifficulty;
  // level se mantiene por compatibilidad con versiones antiguas del proyecto.

  // ----- DURACIÓN -----
  duration?: string;       
  // Texto visible: "16 h · 8 clases".

  durationHours?: number;  
  // Número usado para cálculos internos si se necesita.

  totalLessons?: number;   
  // Cantidad oficial de clases.

  lessonsCount?: number;   
  // Propiedad heredada (legacy). Se mantiene para evitar romper datos antiguos.

  // ----- DESCRIPCIÓN -----
  shortDescription: string; 
  // Resumen para cards y listados.

  description: string;      
  // Texto completo para la ficha del curso.

  imageUrl?: string;        
  // Imagen principal para el detalle o card.

  modalities: CourseModality[];
  // Presencial, Online, Híbrido (se muestran con íconos en UI).

  stages: string[];
  // Etapas del curso en formato bullet.

  learnOutcomes: string[];
  // Resultados esperados del aprendizaje.

  // ----- RATING -----
  rating?: number;          
  ratingCount?: number;     
  reviews?: CourseReview[];

  // ----- PRECIOS -----
  priceCLP: number;         
  price?: number;           
  priceLabel?: string;      

  // ----- ADMIN -----
  pricePerHour?: number;    
  tags?: string[];          

  // ----- FLAGS PARA UI -----
  showInCarousel?: boolean;
  isFeatured?: boolean;
  isOffer?: boolean;
  isNew?: boolean;
  isActive?: boolean;
}
