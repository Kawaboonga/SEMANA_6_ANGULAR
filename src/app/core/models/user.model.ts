// src/app/core/models/ad-user.model.ts

// Roles disponibles en el sistema.
// admin → acceso total al panel
// instructor → podría tener permisos limitados (futuro)
// user → usuario normal que navega la plataforma
export type UserRole = 'admin' | 'instructor' | 'user';

// Modelo principal del usuario.
// Usado en autenticación, admin de usuarios y futuras validaciones de rol.
export interface User {
  id: string;
  // ID único del usuario. Lo genero desde el front por ahora porque no hay backend real.

  firstName: string;         
  lastName: string;          
  // Nombre y apellido. Se usan en el navbar, perfil, dashboard y formularios.

  email: string;             
  // Identificador principal para login y notificaciones.

  password: string;          
  // Guardado solo en local (fake auth). 
  // En un backend real esto jamás se almacena en texto plano.

  role: UserRole;            
  // Controla los permisos dentro del admin y qué secciones puede ver.

  dateOfBirth: string;       
  // Fecha de nacimiento del usuario en formato YYYY-MM-DD.
  // Se usa en el perfil del usuario y datos generales.

  shippingAddress?: string;
  // Dirección opcional. Útil para envíos de productos o información extra del perfil.

  isActive: boolean;
  // Indica si el usuario está activo en el sistema.
  // En admin se puede desactivar sin borrar la cuenta.

  createdAt: string;         
  // Fecha de creación del usuario (ISO). 
  // Sirve para auditorías y ordenamientos en admin.

  updatedAt?: string;
  // Fecha de última actualización, útil para mostrar cambios recientes.
}
