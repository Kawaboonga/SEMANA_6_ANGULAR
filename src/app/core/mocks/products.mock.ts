
import { Product } from '@core/models/product.model';

/**
 * Listado estático de productos usados como mock de datos.
 *
 * Este arreglo representa el catálogo base de instrumentos, pedales y amplificadores
 * para la sección de productos de SoundSeeker. Sirve para:
 * - Diseñar y probar la UI de listas, grillas, filtros y detalles.
 * - Validar paginación, ordenamiento, tags y categorías.
 * - Trabajar sin depender todavía de un backend real.
 *
 * Cada `Product` incluye:
 * - Información general: `id`, `slug`, `name`, `description`, `shortDescription`.
 * - Metadatos de catálogo: `category`, `brand`, `model`, `year`, `tags`.
 * - Estado de venta: `condition`, `level`, `modality`, `location`.
 * - Datos de precio: `price`, `previousPrice` (si existe), `currency`.
 * - Información visual: `imageUrl`.
 * - Métricas: `rating`, `reviewCount` (cuando aplica).
 * - Fechas de creación: `createdAt`, útil para ordenar por “más nuevo”.
 *
 * @usageNotes
 * - Este mock se puede reemplazar por una API HTTP en el futuro sin cambiar
 *   la interfaz `Product`.
 * - Si se agregan nuevos campos en `Product`, recordar mantener actualizado este mock.
 * - Puedes usar `tags`, `category`, `brand` y `condition` para construir filtros
 *   en el front (por ejemplo, checkboxes y chips).
 * - Ideal para probar secciones como “Ofertas”, “Nuevos ingresos” o “Recomendados”.
 *
 * @example
 * // Ejemplo en ProductService:
 * getAll(): Product[] {
 *   return PRODUCTS_MOCK;
 * }
 *
 * // Uso en un componente:
 * this.products = this.productService.getAll();
 */

export const PRODUCTS_MOCK: Product[] = [
  {
    id: '1',
      slug: 'fender-player-telecaster',
      name: 'Fender Player Telecaster',
      description: 'Telecaster clásica ideal para rock e indie.',
      shortDescription: 'Telecaster Player serie México, perfecta para rock e indie.',
      category: 'guitarras',
      brand: 'Fender',
      model: 'Player',
      year: 2002,
      price: 650000,
      previousPrice: 720000,
      currency: 'CLP',
      condition: 'usado',
      level: 'intermedio',
      modality: 'venta',
      location: 'Santiago',
      imageUrl: '/assets/img/products/Fender-Player-Telecaster.jpg',
      tags: ['fender', 'telecaster', 'single-coil'],
      createdAt: '2025-10-01T12:00:00Z',
      rating: 4.8,
      reviewCount: 12,
    },

    {
      id: '2',
      slug: 'squier-precision-bass',
      name: 'Squier Precision Bass',
      description: 'Bajo eléctrico ideal para comenzar en el mundo del bajo.',
      shortDescription: 'Precision Bass para principiantes, cómodo y versátil.',
      category: 'bajos',
      brand: 'Squier',
      model: 'Precision',
      year: 2002,
      price: 350000,
      currency: 'CLP',
      condition: 'usado',
      level: 'principiante',
      modality: 'venta',
      location: 'Santiago',
      imageUrl: '/assets/img/products/Squier-Precision-Bass.jpg',
      tags: ['bajo', 'squier'],
      createdAt: '2025-10-05T10:00:00Z',
    },

    {
      id: '3',
      slug: 'boss-ds1-distortion',
      name: 'Boss DS-1 Distortion',
      description: 'Pedal de distorsión clásico con gran carácter.',
      shortDescription: 'Distorsión versátil y potente, ideal para rock.',
      category: 'pedales',
      brand: 'Boss',
      model: 'DS-1',
      year: 2002,
      price: 65000,
      currency: 'CLP',
      condition: 'usado',
      level: 'avanzado',
      modality: 'venta',
      location: 'Santiago',
      imageUrl: '/assets/img/products/Boss-DS-1-Distortion.jpg',
      tags: ['distorsión', 'boss'],
      createdAt: '2025-09-20T10:00:00Z',
    },

    {
      id: '4',
      slug: 'marshall-mg15fx',
      name: 'Marshall MG15FX',
      description: 'Amplificador compacto con efectos digitales.',
      shortDescription: 'Combo 15W con delay, chorus y reverb integrados.',
      category: 'amplificadores',
      brand: 'Marshall',
      model: 'MG15FX',
      year: 2002,
      price: 180000,
      currency: 'CLP',
      condition: 'nuevo',
      level: 'principiante',
      modality: 'venta',
      location: 'Santiago',
      imageUrl: '/assets/img/products/Marshall-MG15FX.jpg',
      tags: ['marshall', 'amp'],
      createdAt: '2025-10-02T15:00:00Z',
    },

    {
      id: '5',
      slug: 'fender-stratocaster-player',
      name: 'Fender Stratocaster Player',
      description: 'Strat moderna con tono brillante.',
      shortDescription: 'Stratocaster Player con sonido brillante y versátil.',
      category: 'guitarras',
      brand: 'Fender',
      model: 'Player Stratocaster',
      year: 2002,
      price: 680000,
      currency: 'CLP',
      condition: 'usado',
      level: 'intermedio',
      modality: 'venta',
      location: 'Santiago',
      imageUrl: '/assets/img/products/Fender-Stratocaster-Player.jpg',
      tags: ['stratocaster', 'fender'],
      createdAt: '2025-10-08T14:00:00Z',
    },

    {
      id: '6',
      slug: 'yamaha-rbx375',
      name: 'Yamaha RBX375',
      description: 'Bajo de 5 cuerdas versátil para varios estilos.',
      shortDescription: 'Bajo Yamaha de 5 cuerdas, ideal para rock y fusión.',
      category: 'bajos',
      brand: 'Yamaha',
      model: 'RBX375',
      year: 2002,
      price: 420000,
      currency: 'CLP',
      condition: 'usado',
      level: 'intermedio',
      modality: 'venta',
      location: 'Santiago',
      imageUrl: '/assets/img/products/Yamaha-RBX375.jpg',
      tags: ['bajo', 'yamaha'],
      createdAt: '2025-09-30T13:00:00Z',
    },

    {
      id: '7',
      slug: 'ehx-memory-man',
      name: 'Electro-Harmonix Memory Man',
      description: 'Delay analógico cálido con vibrato.',
      shortDescription:
        'Delay analógico con vibrato, ideal para texturas atmosféricas.',
      category: 'pedales',
      brand: 'Electro-Harmonix',
      model: 'Memory Man',
      year: 2002,
      price: 250000,
      currency: 'CLP',
      condition: 'usado',
      level: 'avanzado',
      modality: 'venta',
      location: 'Santiago',
      imageUrl: '/assets/img/products/Electro-Harmonix-Memory.jpg',
      tags: ['delay', 'ehx'],
      createdAt: '2025-09-12T18:00:00Z',
    },

    {
      id: '8',
      slug: 'orange-crush-20rt',
      name: 'Orange Crush 20RT',
      description: 'Amplificador de práctica con afinador y reverb.',
      shortDescription:
        'Amplificador de práctica 20W con reverb y afinador integrado.',
      category: 'amplificadores',
      brand: 'Orange',
      model: 'Crush 20RT',
      year: 2002,
      price: 200000,
      currency: 'CLP',
      condition: 'nuevo',
      level: 'intermedio',
      modality: 'venta',
      location: 'Santiago',
      imageUrl: '/assets/img/products/Orange-Crush-20RT.jpg',
      tags: ['orange', 'amp'],
      createdAt: '2025-10-11T16:00:00Z',
    },

    {
      id: '9',
      slug: 'ibanez-rg421-ex',
      name: 'Ibanez RG421EX',
      description:
        'Durante más de 40 años, Ibanez ha sido pionero en nuevas fronteras en el desarrollo de bajos, ampliando los límites de los diseños convencionales a bajistas de todos los estilos, brindando nuevas vías de expresión y creatividad. Este espíritu de exploración ha llevado a la creación de algunos de los bajos más exitosos y populares de todos los tiempos. Siguiendo este mismo impulso de traer ideas nuevas y relevantes a la vanguardia musical es lo que sirve como base para este proyecto en curso, El ímpetu detrás de cada uno de estos instrumentos únicos proviene desde el deseo del equipo de desarrollo de bajos de Ibanez de satisfacer las necesidades particulares de muchos, para aquellos que anhelan explorar nuevas perspectivas sonoras a través del bajo.',
      shortDescription: 'RG de perfil rápido, perfecta para metal moderno.',
      category: 'guitarras',
      brand: 'Ibanez',
      model: 'RG421EX',
      year: 2002,
      price: 390000,
      currency: 'CLP',
      condition: 'usado',
      level: 'intermedio',
      modality: 'venta',
      location: 'Santiago',
      imageUrl: '/assets/img/products/Ibanez-RG421EX.jpg',
      tags: ['ibanez', 'metal'],
      createdAt: '2025-10-02T14:40:00Z',
    },

    {
      id: '10',
      slug: 'boss-ce2w-chorus',
      name: 'Boss CE-2W Waza Craft Chorus',
      description: 'Versión moderna del legendario CE-2.',
      shortDescription: 'Chorus Waza Craft con modos clásicos CE-1 y CE-2.',
      category: 'pedales',
      brand: 'Boss',
      model: 'CE-2W',
      year: 2002,
      price: 260000,
      currency: 'CLP',
      condition: 'nuevo',
      level: 'avanzado',
      modality: 'venta',
      location: 'Santiago',
      imageUrl: '/assets/img/products/Boss-CE-2W.jpg',
      tags: ['chorus', 'waza'],
      createdAt: '2025-10-15T17:10:00Z',
    },

    {
      id: '11',
      slug: 'epiphone-les-paul-standard',
      name: 'Epiphone Les Paul Standard',
      description: 'Sonido cálido y cuerpo clásico con humbuckers.',
      shortDescription:
        'Les Paul Standard con humbuckers cálidos y sustain clásico.',
      category: 'guitarras',
      brand: 'Epiphone',
      model: 'Les Paul Standard',
      year: 2002,
      price: 520000,
      currency: 'CLP',
      condition: 'usado',
      level: 'intermedio',
      modality: 'venta',
      location: 'Santiago',
      imageUrl: '/assets/img/products/Gibson-SG-Special.jpg',
      tags: ['les paul', 'epiphone'],
      createdAt: '2025-09-12T09:15:00Z',
    },

    {
      id: '12',
      slug: 'ibanez-sr300e-bass',
      name: 'Ibanez SR300E Bass',
      description:
        'Durante más de 40 años, Ibanez ha sido pionero en nuevas fronteras en el desarrollo de bajos, ampliando los límites de los diseños convencionales a bajistas de todos los estilos, brindando nuevas vías de expresión y creatividad. Este espíritu de exploración ha llevado a la creación de algunos de los bajos más exitosos y populares de todos los tiempos. Siguiendo este mismo impulso de traer ideas nuevas y relevantes a la vanguardia musical es lo que sirve como base para este proyecto en curso, El ímpetu detrás de cada uno de estos instrumentos únicos proviene desde el deseo del equipo de desarrollo de bajos de Ibanez de satisfacer las necesidades particulares de muchos, para aquellos que anhelan explorar nuevas perspectivas sonoras a través del bajo.',
      shortDescription:
        'Bajo activo SR300E con EQ de 3 bandas para tono flexible.',
      category: 'bajos',
      brand: 'Ibanez',
      model: 'SR300E',
      year: 2002,
      price: 430000,
      currency: 'CLP',
      condition: 'nuevo',
      level: 'intermedio',
      modality: 'venta',
      location: 'Santiago',
      imageUrl: '/assets/img/products/Ibanez-SR300E-Bass-.jpg',
      tags: ['ibanez', 'bass'],
      createdAt: '2025-10-20T12:30:00Z',
    },

    {
      id: '13',
      slug: 'line6-hx-stomp',
      name: 'Line 6 HX Stomp',
      description: 'Procesador multiefectos con gran calidad sonora.',
      shortDescription:
        'Multiefectos compacto con modelos de amplis y efectos HX.',
      category: 'pedales',
      brand: 'Line 6',
      model: 'HX Stomp',
      year: 2002,
      price: 720000,
      currency: 'CLP',
      condition: 'usado',
      level: 'avanzado',
      modality: 'venta',
      location: 'Santiago',
      imageUrl: '/assets/img/products/Line-6-HX-Stomp.jpg',
      tags: ['multiefectos', 'line6'],
      createdAt: '2025-09-22T11:00:00Z',
    },

    {
      id: '14',
      slug: 'vox-ac15c1',
      name: 'Vox AC15C1',
      description: 'Amplificador valvular clásico con sonido británico.',
      shortDescription:
        'Combo valvular de 15W con el clásico sonido Vox británico.',
      category: 'amplificadores',
      brand: 'Vox',
      model: 'AC15C1',
      year: 2002,
      price: 820000,
      currency: 'CLP',
      condition: 'usado',
      level: 'avanzado',
      modality: 'venta',
      location: 'Santiago',
      imageUrl: '/assets/img/products/Vox-AC15C1-.jpg',
      tags: ['vox', 'tube'],
      createdAt: '2025-10-21T18:00:00Z',
    },

    {
      id: '15',
      slug: 'tc-electronic-polytune',
      name: 'TC Electronic Polytune 3',
      description: 'Afinador rápido y preciso con modo buffer.',
      shortDescription:
        'Afinador polifónico rápido con opción de buffer siempre activo.',
      category: 'pedales',
      brand: 'TC Electronic',
      model: 'Polytune 3',
      year: 2002,
      price: 110000,
      currency: 'CLP',
      condition: 'nuevo',
      level: 'avanzado',
      modality: 'venta',
      location: 'Santiago',
      imageUrl: '/assets/img/products/TC-Electronic-Polytune-3.jpg',
      tags: ['afinador', 'tc'],
      createdAt: '2025-10-03T11:50:00Z',
    },

    {
      id: '16',
      slug: 'gibson-sg-special',
      name: 'Gibson SG Special',
      description: 'Guitarra ligera con ataque agresivo y gran sustain.',
      shortDescription:
        'SG ligera con mucho ataque, ideal para rock clásico y hard rock.',
      category: 'guitarras',
      brand: 'Gibson',
      model: 'SG Special',
      year: 2002,
      price: 900000,
      currency: 'CLP',
      condition: 'usado',
      level: 'avanzado',
      modality: 'venta',
      location: 'Santiago',
      imageUrl: '/assets/img/products/Gibson-SG-Special.jpg',
      tags: ['gibson', 'sg'],
      createdAt: '2025-10-19T14:00:00Z',
    },
];
