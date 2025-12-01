// src/app/core/services/auth.ts

import { Injectable, signal } from '@angular/core';
import { User } from '@core/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // ============================================================
  // 1) STATE: usuarios registrados y usuario actual
  // ============================================================
  // Por ahora todo es mock local en memoria, sin backend real.
  // _users: listado de usuarios que puede usar el login.
  private _users = signal<User[]>([
    // Usuario admin de ejemplo (para probar el panel /admin)
    {
      id: 'u1',
      firstName: 'Admin',
      lastName: 'SoundSeeker',
      email: 'admin@soundseeker.cl',
      password: 'Admin123', // solo para demo local, sin cifrado
      role: 'admin',
      dateOfBirth: '1990-01-01',
      shippingAddress: '',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // Usuario estándar de ejemplo (rol "user")
    {
      id: 'u2',
      firstName: 'User',
      lastName: 'SoundSeeker',
      email: 'user@soundseeker.cl',
      password: 'User123', // solo para demo local, sin cifrado
      role: 'user',
      dateOfBirth: '1990-01-01',
      shippingAddress: '',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  // Exposición de solo lectura de la lista de usuarios
  // (útil para pantallas de administración).
  users = this._users.asReadonly();

  // _currentUser: guarda el usuario que está logueado actualmente.
  private _currentUser = signal<User | null>(null);

  // Exposición de solo lectura del usuario actual
  // para navbar, páginas de cuenta, etc.
  currentUser = this._currentUser.asReadonly();

  // ============================================================
  // 2) LOGIN / LOGOUT
  //    (coincide con login.ts → this.auth.login({ email, password }))
  // ============================================================
  // Intenta autenticar con email y password.
  // Retorna un objeto simple { success, message? } que el componente puede interpretar.
  login(payload: {
    email: string;
    password: string;
  }): { success: boolean; message?: string } {
    const { email, password } = payload;

    // Busca un usuario que coincida por correo, password y que esté activo.
    const user = this._users().find(
      (u) => u.email === email && u.password === password && u.isActive,
    );

    if (!user) {
      return {
        success: false,
        message: 'Correo o contraseña incorrectos, o el usuario está inactivo.',
      };
    }

    // Si todo ok, guardo al usuario como "sesión actual".
    this._currentUser.set(user);
    return { success: true };
  }

  // Cierra la sesión: limpia el usuario actual.
  logout(): void {
    this._currentUser.set(null);
  }

  // ============================================================
  // 3) HELPERS para guards y componentes
  // ============================================================
  // Indica si hay alguien logueado.
  // Lo usan los guards y el navbar.
  isLoggedIn(): boolean {
    return !!this._currentUser();
  }

  // Indica si el usuario actual tiene rol admin.
  // Útil para mostrar/ocultar enlaces de /admin y proteger rutas.
  isAdmin(): boolean {
    const user = this._currentUser();
    return !!user && user.role === 'admin';
  }

  // ============================================================
  // 4) CRUD de usuarios (Admin + pantallas de perfil)
  // ============================================================
  // Agrega un nuevo usuario a la lista.
  // En un backend real esto sería un POST.
  addUser(newUser: User): void {
    this._users.update((list) => [...list, newUser]);
  }

  // Actualiza los datos de un usuario existente.
  // También actualiza el currentUser si coincide con el usuario logueado.
  updateUser(updated: User): void {
    // Actualiza el listado general
    this._users.update((list) =>
      list.map((u) =>
        u.id === updated.id
          ? {
              ...u,
              ...updated,
              updatedAt: new Date().toISOString(),
            }
          : u,
      ),
    );

    // Si el usuario editado es el mismo que está logueado,
    // también se actualiza el estado _currentUser.
    const current = this._currentUser();
    if (current && current.id === updated.id) {
      this._currentUser.set({
        ...current,
        ...updated,
      });
    }
  }

  // Elimina un usuario por id.
  // Si es el usuario logueado, también se hace logout.
  deleteUser(id: string): void {
    this._users.update((list) => list.filter((u) => u.id !== id));

    const current = this._currentUser();
    if (current?.id === id) {
      this._currentUser.set(null);
    }
  }

  // ============================================================
  // 5) RECUPERAR CONTRASEÑA (flujo simple para la demo)
  // ============================================================
  // Simula un flujo de recuperación de contraseña.
  // En un backend real aquí se dispararía el envío de un correo.
  recoverPassword(email: string): { success: boolean; message: string } {
    const user = this._users().find((u) => u.email === email);

    if (!user) {
      return {
        success: false,
        message: 'No encontramos un usuario con ese correo.',
      };
    }

    return {
      success: true,
      message: 'Si el correo existe, te enviaremos instrucciones de recuperación.',
    };
  }
}
