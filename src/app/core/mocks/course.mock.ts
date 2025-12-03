import { Course } from '@core/models/course.model';

/**
 * Listado estático de cursos usados como mock de datos.
 *
 * Este arreglo permite trabajar sin backend mientras se construye el
 * front-end, y sirve como base para pruebas de UI, pruebas de componentes
 * y desarrollo rápido del catálogo.
 *
 * Cada objeto sigue la estructura definida en `Course`, incluyendo:
 * - información principal (id, slug, title)
 * - datos del tutor
 * - dificultad y nivel
 * - duración detallada
 * - descripciones breves y largas
 * - imágenes
 * - modalidades
 * - etapas del curso y aprendizajes
 * - reviews de estudiantes
 * - flags de visualización (featured, new, carousel, etc.)
 * - precios en CLP
 *
 * @usageNotes
 * - Este mock se puede reemplazar por una llamada HTTP real cuando exista una API.
 * - Si se agregan propiedades nuevas en el modelo `Course`, recordar reflejarlas aquí.
 * - Todos los precios y flags (`isFeatured`, `isOffer`, etc.) son 100% editables.
 * - Ideal para pruebas visuales de lista, grillas, sliders y carousels.
 *
 * @example
 * // Ejemplo de uso en CourseService:
 * getAll(): Course[] {
 *   return COURSES_MOCK;
 * }
 *
 * // Ejemplo en un componente:
 * this.courses = this.courseService.getAll();
 */
export const COURSES_MOCK: Course[] = [

  {
    id: 'curso-guitarra-rock',
    slug: 'curso-intensivo-guitarra-rock',
    title: 'Curso intensivo de guitarra rock',
    tutorId: 'marco-vidal',
    tutorName: 'Marco Vidal',

    difficulty: 'Intermedio',
    level: 'Intermedio',

    duration: '16 h · 8 clases',
    durationHours: 16,
    totalLessons: 8,
    lessonsCount: 8,

    shortDescription: 'Domina riffs, power chords y solos básicos de rock.',
    description:
      'En este curso trabajarás repertorio real de rock, técnica de púa, palm mute, power chords y construcción de solos sencillos sobre backing tracks.',
    imageUrl: '/assets/img/course/curso-guitarra-e2.jpg',

    rating: 4.8,
    ratingCount: 32,

    modalities: ['Presencial', 'Online'],

    stages: [
      'Fundamentos de palm mute',
      'Riffs clásicos',
      'Power chords y progresiones',
      'Introducción a solos',
    ],
    learnOutcomes: [
      'Tocar riffs con buen timing.',
      'Entender progresiones de rock.',
      'Improvisar solos sencillos.',
    ],

    reviews: [
      {
        author: 'Estudiante 1',
        rating: 5,
        comment: 'Curso muy práctico, lleno de ejemplos reales.',
        createdAt: '2024-05-10',
      },
    ],

    showInCarousel: true,
    isFeatured: true,
    isOffer: false,
    isNew: true,
    isActive: true,

    priceCLP: 89990,
    price: 89990,
    priceLabel: '$89.990',
  },

  // ... RESTO DEL MOCK SIN CAMBIOS ...
  
];
