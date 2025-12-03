
import { Injectable } from '@angular/core';
import { Product } from '@core/models/product.model';

/**
 * Modelo mínimo para usuarios internos del panel de administración.
 *
 * Este modelo **no** es el mismo que el de usuarios generales del sitio
 * (los gestionados por AuthService).  
 * Aquí solo se controla quién tiene acceso al panel `/admin`
 * y qué nivel de permisos posee.
 *
 * @usageNotes
 * - En un backend real, estos roles podrían unificarse con AuthService.
 * - Los roles definen permisos: admin (total), editor (intermedio), viewer (solo lectura).
 *
 * @example
 * const admin: AdminUser = {
 *   id: 'u1',
 *   name: 'Administrador',
 *   email: 'admin@soundseeker.cl',
 *   role: 'admin',
 *   isActive: true
 * };
 */
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
/**
 * Servicio de datos para el panel de administración.
 *
 * Su propósito es simple:
 * - Mantener productos administrables desde `/admin`.
 * - Administrar usuarios internos del panel (distintos del registro del sitio).
 *
 * Todo funciona con almacenamiento local en memoria, sin backend real.
 * Esto facilita pruebas del dashboard sin obligarte a levantar APIs externas.
 *
 * @usageNotes
 * - Cuando exista backend real, este servicio debería reemplazarse por llamadas HTTP.
 * - El panel lee y escribe directamente sobre estos arreglos.
 */
export class AdminDataService {
  // ============================================================
  // SECCIÓN: PRODUCTOS (CRUD local)
  // ============================================================

  /**
   * Lista de productos manejados desde el panel de administración.
   * Por ahora funciona como “storage temporal” en memoria.
   */
  products: Product[] = [];

  /**
   * Agrega un producto al listado interno.
   *
   * @param p producto a agregar
   *
   * @example
   * this.adminData.addProduct(nuevoProducto);
   */
  addProduct(p: Product) {
    this.products.push(p);
  }

  /**
   * Actualiza un producto buscando coincidencia por ID.
   *
   * @param updated producto actualizado
   */
  updateProduct(updated: Product) {
    this.products = this.products.map((p) =>
      p.id === updated.id ? updated : p,
    );
  }

  /**
   * Elimina un producto del listado usando su ID.
   *
   * @param id ID del producto a eliminar
   */
  deleteProduct(id: string) {
    this.products = this.products.filter((p) => p.id !== id);
  }

  // ============================================================
  // SECCIÓN: USUARIOS DE ADMIN (roles internos)
  // ============================================================

  /**
   * Usuarios internos del panel /admin.
   * Controlan permisos y accesos dentro del dashboard.
   *
   * @usageNotes
   * - No corresponde al usuario “normal” del sitio.
   * - Es puramente para roles internos del panel.
   */
  users: AdminUser[] = [
    {
      id: 'u-admin',
      name: 'Admin Principal',
      email: 'admin@soundseeker.cl',
      role: 'admin',
      isActive: true,
    },
    {
      id: 'u-editor',
      name: 'Editor Contenidos',
      email: 'editor@soundseeker.cl',
      role: 'editor',
      isActive: true,
    },
  ];

  /**
   * Agrega un usuario interno al panel de administración.
   *
   * @param user nuevo AdminUser
   */
  addUser(user: AdminUser) {
    this.users.push(user);
  }

  /**
   * Actualiza un usuario interno existente.
   *
   * @param updated usuario actualizado
   */
  updateUser(updated: AdminUser) {
    this.users = this.users.map((u) =>
      u.id === updated.id ? updated : u,
    );
  }

  /**
   * Elimina un usuario del panel de administración.
   *
   * @param id ID del usuario interno a eliminar
   *
   * @example
   * this.adminData.deleteUser('u-admin');
   */
  deleteUser(id: string) {
    this.users = this.users.filter((u) => u.id !== id);
  }
}
