

// src/app/shared/services/carousel-data.service.ts

import { Injectable } from '@angular/core';
import { CarouselItem } from '../components/carousel/carousel.types';

@Injectable({
  providedIn: 'root',
})
export class CarouselDataService {
  getTutorItems(): CarouselItem[] {
    return [
      {
        id: 'tutor-1',
        type: 'tutor',
        title: 'Camila Montt',
        subtitle: 'Tapping y rock moderno',   
        instrument: 'Guitarra eléctrica',
        location: 'Comuna',
        level: 'Intermedio / Avanzado',
        rating: 4.9,
        imageUrl:
          'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=80',
        description: 'Rock y metal, con práctica en amplificadores reales.',
        ctaLabel: 'Ver tutor',
      },
      {
        id: 'tutor-2',
        type: 'tutor',
        title: 'Diego',
        subtitle: 'Bajo funk',
        location: 'Comuna',
        level: 'Todos los niveles',
        rating: 4.8,
        imageUrl:
          'https://images.unsplash.com/photo-1513530534585-c7b1394c6d51?auto=format&fit=crop&w=900&q=80',
        description: 'Groove, slap y fundamentos de teoría para bajistas modernos.',
        ctaLabel: 'Ver tutor',
      },
      {
        id: 'tutor-3',
        type: 'tutor',
        title: 'Pablo',
        subtitle: 'Guitarra clásica',
        instrument: 'Guitarra clásica',
        location: 'Comuna',
        level: 'Inicial / Intermedio',
        rating: 4.7,
        imageUrl:
          'https://images.unsplash.com/photo-1513530534585-c7b1394c6d51?auto=format&fit=crop&w=900&q=80',
        description: 'Técnica básica, lectura y repertorio popular.',
        ctaLabel: 'Ver tutor',
      },
      {
        id: 'tutor-4',
        type: 'tutor',
        title: 'Isidora',
        subtitle: 'Teoría y armonía',
        instrument: 'Teoría musical',
        location: 'Comuna',
        level: 'Avanzado',
        rating: 4.9,
        imageUrl:
          'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80',
        description: 'Armonía moderna aplicada a guitarra y bajo.',
        ctaLabel: 'Ver tutor',
      },
      {
        id: 'tutor-5',
        type: 'tutor',
        title: 'Felipe',
        subtitle: 'Improvisación rock',
        instrument: 'Guitarra eléctrica',
        location: 'Comuna',
        level: 'Intermedio',
        rating: 4.6,
        imageUrl:
          'https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=900&q=80',
        description: 'Escalas, modos y fraseo para solos con identidad.',
        ctaLabel: 'Ver tutor',
      },
      {
        id: 'tutor-6',
        type: 'tutor',
        title: 'Laura',
        subtitle: 'Ensamble de bandita',
        instrument: 'Ensamble',
        location: 'Comuna',
        level: 'Inicial',
        rating: 4.8,
        imageUrl:
          'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80',
        description: 'Arma tu primera banda y toca en vivo.',
        ctaLabel: 'Ver tutor',
      },
      {
        id: 'tutor-7',
        type: 'tutor',
        title: 'Nicolás',
        subtitle: 'Home studio',
        instrument: 'Producción',
        location: 'Comuna',
        level: 'Todos los niveles',
        rating: 4.7,
        imageUrl:
          'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=900&q=80',
        description: 'Graba tus guitarras y bajos desde casa.',
        ctaLabel: 'Ver tutor',
      },
      {
        id: 'tutor-8',
        type: 'tutor',
        title: 'Andrea',
        subtitle: 'Slap',
        instrument: 'Bajo eléctrico',
        location: 'Comuna',
        level: 'Intermedio',
        rating: 4.9,
        imageUrl:
          'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=900&q=80',
        description: 'Sonido moderno, slap y armonía aplicada.',
        ctaLabel: 'Ver tutor',
      },
    ];
  }

  getProductItems(): CarouselItem[] {
    return [
      {
        id: 'product-1',
        type: 'product',
        title: 'Fender Stratocaster Player',
        subtitle: 'Guitarra eléctrica',
        price: 680000,
        previousPrice: 820000,
        badge: 'Usado premium',
        imageUrl:
          'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=80',
        description: 'Hecha en México, pastillas Alnico, perfectas condiciones.',
        ctaLabel: 'Ver producto',
      },
      {
        id: 'product-2',
        type: 'product',
        title: 'Squier Jazz Bass Vintage Modified',
        subtitle: 'Bajo eléctrico',
        price: 350000,
        previousPrice: 420000,
        badge: 'Oferta',
        imageUrl:
          'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=900&q=80',
        description: 'Ideal para funk y soul, acción baja y cómoda.',
        ctaLabel: 'Ver producto',
      },
      {
        id: 'product-3',
        type: 'product',
        title: 'Pedal Overdrive Tube Screamer',
        subtitle: 'Efecto guitarra',
        price: 90000,
        previousPrice: 120000,
        badge: 'Clásico',
        imageUrl:
          'https://images.unsplash.com/photo-1485579149621-3123dd979885?auto=format&fit=crop&w=900&q=80',
        description: 'Sonido icónico para solos y crunch suave.',
        ctaLabel: 'Ver producto',
      },
      {
        id: 'product-4',
        type: 'product',
        title: 'Boss DD-7 Digital Delay',
        subtitle: 'Pedal delay',
        price: 140000,
        previousPrice: 180000,
        badge: 'Destacado',
        imageUrl:
          'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=900&q=80',
        description: 'Repeticiones claras, modo analógico y modulado.',
        ctaLabel: 'Ver producto',
      },
      {
        id: 'product-5',
        type: 'product',
        title: 'Amplificador Vox AC15',
        subtitle: 'Amp válvulas',
        price: 520000,
        previousPrice: 600000,
        badge: 'Warm tone',
        imageUrl:
          'https://images.unsplash.com/photo-1485579149621-3123dd979885?auto=format&fit=crop&w=900&q=80',
        description: 'Perfecto para rock alternativo y brit pop.',
        ctaLabel: 'Ver producto',
      },
      {
        id: 'product-6',
        type: 'product',
        title: 'Cabinet 2x12 Celestion',
        subtitle: 'Pantalla guitarra',
        price: 300000,
        previousPrice: 360000,
        badge: 'Heavy',
        imageUrl:
          'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80',
        description: 'Ideal para escenarios pequeños y medianos.',
        ctaLabel: 'Ver producto',
      },
      {
        id: 'product-7',
        type: 'product',
        title: 'Multi efectos Line 6 HX Stomp',
        subtitle: 'Multiefecto digital',
        price: 520000,
        previousPrice: 650000,
        badge: 'Modern',
        imageUrl:
          'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=900&q=80',
        description: 'Amps, efectos y presets listos para escenario.',
        ctaLabel: 'Ver producto',
      },
      {
        id: 'product-8',
        type: 'product',
        title: 'Compresor MXR Dyna Comp',
        subtitle: 'Pedal compresor',
        price: 80000,
        previousPrice: 95000,
        badge: 'Slap friendly',
        imageUrl:
          'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?auto=format&fit=crop&w=900&q=80',
        description: 'Ataque rápido, ideal para funk y pop.',
        ctaLabel: 'Ver producto',
      },
    ];
  }

  getCourseItems(): CarouselItem[] {
    return [
      {
        id: 'course-1',
        type: 'course',
        title: 'Curso Guitarra Desde Cero',
        subtitle: '8 semanas',
        level: 'Inicial',
        price: 90000,
        imageUrl:
          'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=900&q=80',
        description: 'Acordes básicos, ritmos y tu primera canción completa.',
        ctaLabel: 'Ver curso',
      },
      {
        id: 'course-2',
        type: 'course',
        title: 'Bajo Groove y Funk',
        subtitle: '6 semanas',
        level: 'Intermedio',
        price: 110000,
        imageUrl:
          'https://images.unsplash.com/photo-1465847899084-d164df4dedc3?auto=format&fit=crop&w=900&q=80',
        description: 'Slap, ghost notes y líneas con mucho groove.',
        ctaLabel: 'Ver curso',
      },
      {
        id: 'course-3',
        type: 'course',
        title: 'Pedales y Señal en Cadena',
        subtitle: '4 semanas',
        level: 'Todos los niveles',
        price: 70000,
        imageUrl:
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
        description: 'Cómo ordenar pedales y construir tu sonido.',
        ctaLabel: 'Ver curso',
      },
      {
        id: 'course-4',
        type: 'course',
        title: 'Improvisación Rock',
        subtitle: '6 semanas',
        level: 'Intermedio / Avanzado',
        price: 120000,
        imageUrl:
          'https://images.unsplash.com/photo-1471479917193-f00955256257?auto=format&fit=crop&w=900&q=80',
        description: 'Escalas, modos y licks aplicados a backing tracks.',
        ctaLabel: 'Ver curso',
      },
      {
        id: 'course-5',
        type: 'course',
        title: 'Grabación en Home Studio',
        subtitle: '4 semanas',
        level: 'Todos los niveles',
        price: 80000,
        imageUrl:
          'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=80',
        description: 'Interfaces, DAW y flujo de trabajo básico.',
        ctaLabel: 'Ver curso',
      },
      {
        id: 'course-6',
        type: 'course',
        title: 'Guitarra Metal Rítmica',
        subtitle: '6 semanas',
        level: 'Intermedio',
        price: 115000,
        imageUrl:
          'https://images.unsplash.com/photo-1531875456634-3f5418280d19?auto=format&fit=crop&w=900&q=80',
        description: 'Palm mute, alternate picking y riffs pesados.',
        ctaLabel: 'Ver curso',
      },
      {
        id: 'course-7',
        type: 'course',
        title: 'Curso Bajo para Cantantes',
        subtitle: '4 semanas',
        level: 'Inicial',
        price: 75000,
        imageUrl:
          'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=900&q=80',
        description: 'Aprende a acompañarte con bajo y voz.',
        ctaLabel: 'Ver curso',
      },
      {
        id: 'course-8',
        type: 'course',
        title: 'Curso Armonía Moderna',
        subtitle: '8 semanas',
        level: 'Avanzado',
        price: 130000,
        imageUrl:
          'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=900&q=80',
        description: 'Funciones armónicas, sustituciones y voicings.',
        ctaLabel: 'Ver curso',
      },
    ];
  }

  getHighlightItems(): CarouselItem[] {
    return [
      {
        id: 'highlight-1',
        type: 'highlight',
        title: 'Pack inicio guitarra + ampli',
        subtitle: 'Ideal para empezar',
        badge: 'Destacado',
        imageUrl:
          'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=900&q=80',
        description: 'Todo lo que necesitas para tu primera banda.',
        ctaLabel: 'Ver pack',
      },
      {
        id: 'highlight-2',
        type: 'highlight',
        title: 'Mes del Bajo en Huechuraba',
        subtitle: 'Descuentos y clínicas',
        badge: 'Evento',
        imageUrl:
          'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=900&q=80',
        description: 'Actividades especiales con bajistas invitados.',
        ctaLabel: 'Ver más',
      },
      {
        id: 'highlight-3',
        type: 'highlight',
        title: 'Taller de composición para bandas',
        subtitle: '1 jornada intensiva',
        badge: 'Nuevo',
        imageUrl:
          'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80',
        description: 'Arma tu setlist completo con ayuda de un tutor.',
        ctaLabel: 'Inscribirme',
      },
      {
        id: 'highlight-4',
        type: 'highlight',
        title: 'Comunidad SoundSeeker',
        subtitle: 'Comparte tu sonido',
        imageUrl:
          'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=900&q=80',
        description: 'Intercambia equipos, tips y experiencias.',
        ctaLabel: 'Ver comunidad',
      },
      {
        id: 'highlight-5',
        type: 'highlight',
        title: 'Clínica de pedales boutique',
        subtitle: 'Solo 15 cupos',
        badge: 'Limitado',
        imageUrl:
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
        description: 'Descubre pedales raros y cómo usarlos en tu señal.',
        ctaLabel: 'Ver detalles',
      },
      {
        id: 'highlight-6',
        type: 'highlight',
        title: 'Sesión de grabación colaborativa',
        subtitle: 'Graba con otros músicos',
        imageUrl:
          'https://images.unsplash.com/photo-1511379938547-89e49f9a31ed?auto=format&fit=crop&w=900&q=80',
        description: 'Registra una canción completa en un día.',
        ctaLabel: 'Ver detalles',
      },
      {
        id: 'highlight-7',
        type: 'highlight',
        title: 'Muestra anual de alumnos',
        subtitle: 'Escenario abierto',
        imageUrl:
          'https://images.unsplash.com/photo-1511379938547-1df80e77a16e?auto=format&fit=crop&w=900&q=80',
        description: 'Presenta tu proyecto en vivo.',
        ctaLabel: 'Ver evento',
      },
      {
        id: 'highlight-8',
        type: 'highlight',
        title: 'Mentoría para proyectos musicales',
        subtitle: '1 a 1',
        imageUrl:
          'https://images.unsplash.com/photo-1512428232641-6cfdc3f43a1a?auto=format&fit=crop&w=900&q=80',
        description: 'Acompañamiento estratégico para tu banda o proyecto solo.',
        ctaLabel: 'Ver mentoría',
      },
    ];
  }

  getOfferItems(): CarouselItem[] {
    return [
      {
        id: 'offer-1',
        type: 'offer',
        title: 'Pack 4 clases guitarra + pedal OD',
        subtitle: 'Solo este mes',
        price: 150000,
        previousPrice: 210000,
        badge: 'Oferta',
        imageUrl:
          'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=80',
        description: 'Aprende y mejora tu sonido al mismo tiempo.',
        ctaLabel: 'Aprovechar oferta',
      },
      {
        id: 'offer-2',
        type: 'offer',
        title: 'Curso + tutoría personalizada',
        subtitle: 'Guitarra rock',
        price: 180000,
        previousPrice: 240000,
        badge: 'Bundle',
        imageUrl:
          'https://images.unsplash.com/photo-1531875456634-3f5418280d19?auto=format&fit=crop&w=900&q=80',
        description: 'Curso online y 2 sesiones 1 a 1.',
        ctaLabel: 'Aprovechar oferta',
      },
      {
        id: 'offer-3',
        type: 'offer',
        title: '20% OFF en todos los pedales',
        subtitle: 'Solo segunda mano',
        price: 0,
        badge: 'Descuento',
        imageUrl:
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
        description: 'Descuento aplicado directamente en el carrito.',
        ctaLabel: 'Ver pedales',
      },
      {
        id: 'offer-4',
        type: 'offer',
        title: '1 clase gratis al recomendar amigo',
        subtitle: 'Para cursos seleccionados',
        price: 0,
        badge: 'Promo',
        imageUrl:
          'https://images.unsplash.com/photo-1523755231516-e43fd2e8dca5?auto=format&fit=crop&w=900&q=80',
        description: 'Ambos reciben una clase de regalo.',
        ctaLabel: 'Ver detalles',
      },
      {
        id: 'offer-5',
        type: 'offer',
        title: 'Bajo + amplificador combo',
        subtitle: 'Starter pack',
        price: 420000,
        previousPrice: 520000,
        badge: 'Pack',
        imageUrl:
          'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=900&q=80',
        description: 'Todo lo necesario para comenzar.',
        ctaLabel: 'Ver pack',
      },
      {
        id: 'offer-6',
        type: 'offer',
        title: 'Clases en pareja',
        subtitle: '2x1',
        price: 60000,
        previousPrice: 120000,
        badge: '2x1',
        imageUrl:
          'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=900&q=80',
        description: 'Aprende con tu amigo o pareja.',
        ctaLabel: 'Ver oferta',
      },
      {
        id: 'offer-7',
        type: 'offer',
        title: 'Sesión de setup gratis',
        subtitle: 'Por compra de guitarra',
        price: 0,
        badge: 'Extra',
        imageUrl:
          'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=900&q=80',
        description: 'Ajuste básico incluido en la compra.',
        ctaLabel: 'Ver productos',
      },
      {
        id: 'offer-8',
        type: 'offer',
        title: 'Black Sound Week',
        subtitle: 'Descuentos generales',
        price: 0,
        badge: 'Evento',
        imageUrl:
          'https://images.unsplash.com/photo-1511379938547-89e49f9a31ed?auto=format&fit=crop&w=900&q=80',
        description: 'Ofertas rotativas toda la semana.',
        ctaLabel: 'Ver todo',
      },
    ];
  }

  getNewsItems(): CarouselItem[] {
    return [
      {
        id: 'news-1',
        type: 'news',
        title: 'Lanzamiento oficial de SoundSeeker',
        subtitle: 'Comunidad de tutores y alumnos',
        dateLabel: '26 Nov 2025',
        imageUrl:
          'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=900&q=80',
        description: 'Conecta con tutores de tu comuna y encuentra tu sonido.',
        ctaLabel: 'Leer más',
      },
      {
        id: 'news-2',
        type: 'news',
        title: 'Nueva categoría: pedales de bajo',
        subtitle: 'Más opciones para tu low end',
        dateLabel: '12 Nov 2025',
        imageUrl:
          'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80',
        description: 'Explora distorsiones, filtros y compresores para bajo.',
        ctaLabel: 'Leer más',
      },
      {
        id: 'news-3',
        type: 'news',
        title: 'Alianzas con salas de ensayo',
        subtitle: 'Precios preferenciales',
        dateLabel: '05 Nov 2025',
        imageUrl:
          'https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=900&q=80',
        description: 'Reserva sala directamente desde SoundSeeker.',
        ctaLabel: 'Leer más',
      },
      {
        id: 'news-4',
        type: 'news',
        title: 'Programa de becas para alumnos',
        subtitle: 'Apoyo a nuevos talentos',
        dateLabel: '28 Oct 2025',
        imageUrl:
          'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=80',
        description: 'Postula a becas parciales para cursos y tutorías.',
        ctaLabel: 'Leer más',
      },
      {
        id: 'news-5',
        type: 'news',
        title: 'Encuentro de guitarristas en Huechuraba',
        subtitle: 'Jam y clínica en vivo',
        dateLabel: '20 Oct 2025',
        imageUrl:
          'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80',
        description: 'Trae tu guitarra y comparte con otros músicos.',
        ctaLabel: 'Leer más',
      },
      {
        id: 'news-6',
        type: 'news',
        title: 'Nueva sección de feedback a tutores',
        subtitle: 'Mejora continua',
        dateLabel: '10 Oct 2025',
        imageUrl:
          'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80',
        description: 'Califica sesiones y ayuda a otros alumnos a elegir.',
        ctaLabel: 'Leer más',
      },
      {
        id: 'news-7',
        type: 'news',
        title: 'Integración con playlists colaborativas',
        subtitle: 'Spotify & YouTube',
        dateLabel: '01 Oct 2025',
        imageUrl:
          'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=900&q=80',
        description: 'Explora playlists creadas por tutores y alumnos.',
        ctaLabel: 'Leer más',
      },
      {
        id: 'news-8',
        type: 'news',
        title: 'Próximo lanzamiento app móvil',
        subtitle: 'Android primero',
        dateLabel: '25 Sep 2025',
        imageUrl:
          'https://images.unsplash.com/photo-1511379938547-1df80e77a16e?auto=format&fit=crop&w=900&q=80',
        description: 'Gestiona tus clases y equipos desde tu teléfono.',
        ctaLabel: 'Leer más',
      },
    ];
  }
}

