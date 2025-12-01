// src/app/core/models/tutor.ts

// Estos tipos base los dejo como string por flexibilidad.
// Más adelante, si quiero validaciones más estrictas, los puedo cambiar a union types.
// Ej: export type TutorInstrument = 'guitarra' | 'bajo' | ...
export type TutorInstrument = string;
export type TutorStyle = string;
export type TutorLevel = string;
export type TutorModality = string;

// Representa un bloque de disponibilidad semanal del tutor.
// Se usa para mostrar qué días y en qué horarios atiende.
export interface WeeklySlot {
  day: string;      // Ej: "Lun", "Mar", "Jue"
  times: string[];  // Ej: ["18:00", "19:30"]
}

// Referencia mínima a un curso que imparte el tutor.
// Esto se usa para mostrar el listado de cursos sin tener que cargar el curso completo.
export interface TutorCourseRef {
  id: string;
  title: string;
  slug?: string;    // opcional porque algunos cursos pueden no tener slug definido aún
}

// Representa una evaluación hecha por un alumno sobre el tutor.
// Sirve para mostrar reseñas con nombre, nota y comentario.
export interface TutorReview {
  author: string;      // nombre de quien escribió la reseña
  rating: number;      // nota del 1 al 5
  comment: string;     // mensaje del alumno
  createdAt: string;   // fecha en string (más fácil de manejar aquí)
}

// Equipamiento del tutor (guitarras, pedales, amplis, etc.).
// Lo uso para mostrar una sección más personal y técnica.
export interface TutorGearItem {
  name: string;           // nombre del equipo
  description: string;    // información breve
  reason?: string;        // por qué lo usa o qué aporta a sus clases
  imageUrl?: string;      // imagen opcional del equipo
}

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
