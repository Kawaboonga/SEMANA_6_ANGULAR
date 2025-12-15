/**
 * Claves únicas para localStorage.
 * Para persistir el estado de cada módulo (productos, preventas, etc.).
 */
export const STORAGE_KEYS = {
  PRODUCTS: 'soundseeker_products',
  // Misma lista de productos que viene del JSON remoto + cambios locales.

  // Separar preventas en otro arreglo:
  // PRESALES: 'soundseeker_presales',

  COURSES: 'soundseeker_courses',
  TUTORS: 'soundseeker_tutors',
  SERVICES: 'soundseeker_services',
  USERS: 'soundseeker_users',
} as const;