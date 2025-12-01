// src/app/core/models/course.model.ts

// Nivel de dificultad del curso.
// Usado en listados, detalle y filtros.
export type CourseDifficulty = 'Principiante' | 'Intermedio' | 'Avanzado';

// Modalidades posibles del curso.
export type CourseModality = 'Presencial' | 'Online' | 'Híbrido';

// Reseñas asociadas al curso. Similar al modelo de tutores.
export interface CourseReview {
  author: string;           // nombre del alumno que dejó la reseña
  rating: number;           // nota del 1 al 5
  comment: string;          // mensaje del alumno
  createdAt: string | Date; // permito Date porque en admin podría transformarse
}

// Modelo principal de curso.
// Se usa en cards, detalles, admin y también dentro del perfil de tutor.
export interface Course {
  id: string;                // ID único
  slug: string;              // slug para rutas limpias: /cursos/guitarra-rock

  title: string;             // título del curso

  tutorId: string;           // para relacionarlo con el tutor
  tutorName: string;         // duplicado para no tener que hacer join en el front

  // Niveles
  difficulty?: CourseDifficulty;  
  level?: CourseDifficulty;       
  // NOTE: level se mantiene por compatibilidad con versiones previas.
  // En el form se iguala a difficulty para simplificar.

  // Duración
  duration?: string;         // visible: "16 h · 8 clases"
  durationHours?: number;    // número para cálculos internos, si algún día se usa
  totalLessons?: number;     // cantidad oficial de clases
  lessonsCount?: number;     // legado, se deja por compatibilidad

  // Contenido descriptivo
  shortDescription: string;  // aparece en cards
  description: string;       // aparece en el detalle del curso

  imageUrl?: string;         // imagen del curso

  modalities: CourseModality[];
  // Modalidades: Presencial, Online o Híbrido (se muestran con íconos)

  stages: string[];          // etapas del curso, listado tipo bullet
  learnOutcomes: string[];   // aprendizajes esperados

  // Rating
  rating?: number;           // promedio
  ratingCount?: number;      // cantidad de evaluaciones
  reviews?: CourseReview[];  // listado de reseñas

  // Precios
  priceCLP: number;          // precio principal en CLP
  price?: number;            // se deja por compatibilidad si quisieras otra moneda
  priceLabel?: string;       // texto alternativo si se quiere manejar una etiqueta

  // Usados SOLO en admin
  pricePerHour?: number;     // cálculo opcional
  tags?: string[];           // categorías internas para organizar cursos

  // Flags visuales usados en home y secciones públicas
  showInCarousel?: boolean;
  isFeatured?: boolean;
  isOffer?: boolean;
  isNew?: boolean;
  isActive?: boolean;
}
