
/**
 * Roles disponibles dentro del sistema.
 *
 * Los roles determinan qué partes del panel o la plataforma puede ver cada usuario.
 * - **admin** → acceso total a la administración.
 * - **instructor** → rol pensado para profesores (a futuro).
 * - **user** → usuario normal que navega la plataforma.
 *
 * @usageNotes
 * - El rol se usa en guards, validaciones de UI y permisos del panel admin.
 * - En el futuro puede expandirse si agregas más tipos de usuario.
 *
 * @example
 * const role: UserRole = 'admin';
 */

export type UserRole = 'admin' | 'instructor' | 'user';

/**
 * Modelo principal del usuario.
 *
 * Representa un perfil completo dentro de SoundSeeker: datos personales,
 * autenticación, actividad, permisos y fechas de auditoría.  
 * Este modelo se usa en:
 * - autenticación (fake auth por ahora),
 * - administración de usuarios,
 * - perfil del usuario,
 * - validaciones de rol y guards.
 *
 * @usageNotes
 * - Actualmente el usuario se guarda en localStorage (fake auth).
 * - En un backend real, la contraseña nunca debe almacenarse en texto plano.
 * - `shippingAddress` y `updatedAt` son opcionales para mantener flexibilidad.
 * - `role` es clave para la navegación y permisos de toda la plataforma.
 *
 * @example
 * const newUser: User = {
 *   id: 'u123',
 *   firstName: 'Marco',
 *   lastName: 'Vidal',
 *   email: 'marco@correo.com',
 *   password: '123456',
 *   role: 'user',
 *   dateOfBirth: '1995-03-10',
 *   isActive: true,
 *   createdAt: new Date().toISOString()
 * };
 */
export interface User {
  id: string;
  // ID único del usuario. Generado desde el front por ahora.

  firstName: string;
  lastName: string;
  // Nombre y apellido. Usados en navbar, dashboard, perfil y formularios.

  email: string;
  // Identificador principal para login y notificaciones.

  password: string;
  // Guardado solo en local (fake auth).
  // En un backend real esto jamás va en texto plano.

  role: UserRole;
  // Controla permisos dentro del admin y qué secciones puede ver.

  dateOfBirth: string;
  // Fecha de nacimiento en formato YYYY-MM-DD.
  // Usada en el perfil y datos generales.

  shippingAddress?: string;
  // Dirección opcional. Útil para envíos o información adicional del perfil.

  isActive: boolean;
  // Indica si el usuario está activo en el sistema.
  // En admin se puede desactivar una cuenta sin eliminarla.

  createdAt: string;
  // Fecha de creación del usuario (ISO).
  // Usado para auditorías y ordenamientos.

  updatedAt?: string;
  // Fecha de última modificación, útil para mostrar cambios recientes.
}
