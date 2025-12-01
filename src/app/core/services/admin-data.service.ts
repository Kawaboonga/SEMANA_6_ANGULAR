// src/app/core/services/admin-data.ts

import { Injectable } from '@angular/core';
import { Product } from '@core/models/product.model';

// Modelo simple para usuarios del panel de administración.
// Este modelo es independiente del modelo de usuarios generales del sitio.
// Más adelante se puede unificar si decides usar un backend real.
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer'; // distintos niveles de permisos
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class AdminDataService {
  // ============================================================
  // SECCIÓN: PRODUCTOS (CRUD local)
  // ============================================================
  // Lista que mantiene los productos administrables desde /admin.
  // Por ahora funciona como almacenamiento temporal en memoria.
  products: Product[] = [];

  // Agrega un producto al listado.
  addProduct(p: Product) {
    this.products.push(p);
  }

  // Reemplaza el producto cuyo id coincide con el editado.
  updateProduct(updated: Product) {
    this.products = this.products.map((p) =>
      p.id === updated.id ? updated : p,
    );
  }

  // Elimina un producto según su id.
  deleteProduct(id: string) {
    this.products = this.products.filter((p) => p.id !== id);
  }

  // ============================================================
  // SECCIÓN: USUARIOS DE ADMIN (roles internos)
  // ============================================================
  // Estos usuarios controlan quién puede entrar al panel /admin.
  // No son los mismos usuarios "normales" del sitio (AuthService).
  users: AdminUser[] = [
    {
      id: 'u-admin',
      name: 'Admin Principal',
      email: 'admin@soundseeker.cl',
      role: 'admin', // permisos completos
      isActive: true,
    },
    {
      id: 'u-editor',
      name: 'Editor Contenidos',
      email: 'editor@soundseeker.cl',
      role: 'editor', // permisos intermedios
      isActive: true,
    },
  ];

  // Agrega un nuevo usuario al panel de administración.
  addUser(user: AdminUser) {
    this.users.push(user);
  }

  // Edita la información de un usuario interno.
  updateUser(updated: AdminUser) {
    this.users = this.users.map((u) =>
      u.id === updated.id ? updated : u,
    );
  }

  // Elimina un usuario del panel de administración.
  deleteUser(id: string) {
    this.users = this.users.filter((u) => u.id !== id);
  }
}
