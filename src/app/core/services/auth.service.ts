import { Injectable, signal } from '@angular/core';
import { User } from '@core/models/user.model';

// ===============================================
// Tipos para el flujo de registro
// ===============================================

/**
 * Datos mínimos que pide el formulario de registro.
 *
 * Se usa en `register()` para crear un nuevo usuario estándar.
 *
 * @example
 * const payload: RegisterPayload = {
 *   firstName: 'Robert',
 *   lastName: 'Inostroza',
 *   email: 'robert@correo.com',
 *   password: 'Clave123'
 * };
 */
export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

/**
 * Resultado de una operación de registro.
 *
 * `success` indica si todo salió bien,  
 * `message` entrega un texto para mostrar en la UI.
 */
export interface RegisterResult {
  success: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
/**
 * Servicio de autenticación principal de la app.
 *
 * Se encarga de:
 * - manejar usuarios en memoria (mock local),
 * - iniciar y cerrar sesión (login / logout),
 * - registrar nuevos usuarios,
 * - exponer el usuario actual como signal,
 * - validar roles (admin / user),
 * - simular recuperación de contraseña,
 * - persistir sesión en localStorage (usuario + token mock),
 * - restaurar sesión al iniciar.
 *
 * @usageNotes
 * - No hay backend real, las contraseñas están en texto plano solo para demo.
 * - Cuando exista API, `login`, `register`, `recoverPassword` y persistencia
 *   deberían delegar la lógica al backend.
 * - `isAdmin()` se usa en guards y componentes para mostrar/ocultar zonas.
 */
export class AuthService {
  // ============================================================
  // Claves para localStorage (persistencia de sesión)
  // ============================================================

  /** Clave para guardar al usuario actual en localStorage. */
  private readonly STORAGE_USER_KEY = 'soundseeker_current_user';

  /** Clave para guardar el token mock de sesión. */
  private readonly STORAGE_TOKEN_KEY = 'token';

  // ============================================================
  // 1) STATE: usuarios registrados y usuario actual
  // ============================================================

  /**
   * Lista de usuarios registrados en memoria (mock local).
   * Incluye un admin y un user para probar flujos.
   */
  private _users = signal<User[]>([
    // Usuario admin de ejemplo (para probar el panel /admin)
    {
      id: 'u1',
      firstName: 'Admin',
      lastName: 'SoundSeeker',
      email: 'admin@soundseeker.cl',
      password: 'Admin123', // solo demo local, sin cifrado
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
      password: 'User123', // solo demo local, sin cifrado
      role: 'user',
      dateOfBirth: '1990-01-01',
      shippingAddress: '',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  /**
   * Lista de usuarios como signal de solo lectura.
   * Útil para pantallas de administración.
   */
  users = this._users.asReadonly();

  /**
   * Usuario que está logueado actualmente (null si no hay sesión).
   */
  private _currentUser = signal<User | null>(null);

  /**
   * Usuario actual expuesto como signal de solo lectura.
   * Usado por el navbar, páginas de cuenta, etc.
   */
  currentUser = this._currentUser.asReadonly();

  /**
   * Al crear el servicio, intenta restaurar sesión desde localStorage.
   */
  constructor() {
    this.restoreSession();
  }

  // ============================================================
  // 2) LOGIN / LOGOUT
  // ============================================================

  /**
   * Intenta autenticar a un usuario con email y contraseña.
   *
   * - Normaliza el correo (lowercase + trim).
   * - Valida que el usuario exista, que la contraseña coincida y esté activo.
   * - Si es correcto, setea `_currentUser` y persiste la sesión.
   *
   * @param payload objeto con email y password
   * @returns `{ success: boolean, message?: string }`
   *
   * @example
   * const result = this.auth.login({ email, password });
   * if (!result.success) { mostrarError(result.message); }
   */
  login(payload: {
    email: string;
    password: string;
  }): { success: boolean; message?: string } {
    const { email, password } = payload;

    // Normalizamos el correo para que no dependa de mayúsculas/minúsculas
    const normalizedEmail = email.trim().toLowerCase();

    // Busca un usuario que coincida por correo, password y que esté activo.
    const user = this._users().find(
      (u) =>
        u.email.trim().toLowerCase() === normalizedEmail &&
        u.password === password &&
        u.isActive,
    );

    if (!user) {
      return {
        success: false,
        message: 'Correo o contraseña incorrectos, o el usuario está inactivo.',
      };
    }

    // Si todo ok, guardo al usuario como "sesión actual".
    this._currentUser.set(user);

    // Persistimos la sesión en localStorage (usuario + token mock)
    this.persistSession(user);

    return { success: true };
  }

  /**
   * Cierra la sesión actual.
   *
   * - Limpia `_currentUser`.
   * - Borra la sesión en localStorage.
   *
   * @example
   * this.auth.logout();
   */
  logout(): void {
    this._currentUser.set(null);
    this.clearSessionStorage();
  }

  // ============================================================
  // 3) HELPERS para guards y componentes
  // ============================================================

  /**
   * Indica si hay alguien logueado actualmente.
   * Usado por guards y navbar.
   *
   * @returns true si existe `currentUser`, false en caso contrario.
   */
  isLoggedIn(): boolean {
    return !!this._currentUser();
  }

  /**
   * Indica si el usuario actual tiene rol `admin`.
   * Se usa para:
   * - mostrar/ocultar enlaces de `/admin`,
   * - proteger rutas en guards.
   *
   * @returns true si el usuario logueado es admin.
   */
  isAdmin(): boolean {
    const user = this._currentUser();
    return !!user && user.role === 'admin';
  }

  // ============================================================
  // 4) REGISTRO DE USUARIOS
  // ============================================================

  /**
   * Comprueba si existe un usuario con el correo dado (case-insensitive).
   *
   * @param email correo a evaluar
   * @returns true si el correo ya está registrado
   */
  emailExists(email: string): boolean {
    const normalized = email.trim().toLowerCase();
    return this._users().some(
      (u) => u.email.trim().toLowerCase() === normalized,
    );
  }

  /**
   * Registra un nuevo usuario en el sistema.
   *
   * Flujo:
   * 1) Verifica si el correo ya está usado.
   * 2) Construye un usuario nuevo con rol `user`.
   * 3) Lo agrega al listado de usuarios.
   * 4) Inicia sesión automáticamente con ese usuario.
   * 5) Persiste la sesión.
   *
   * @param payload datos básicos de registro
   * @returns RegisterResult con `success` y `message`
   *
   * @example
   * const result = this.auth.register(formValue);
   * if (result.success) { navegarADashboard(); }
   */
  register(payload: RegisterPayload): RegisterResult {
    const email = payload.email.trim().toLowerCase();

    // 1) Verificar si el correo ya existe
    if (this.emailExists(email)) {
      return {
        success: false,
        message: 'Ya existe un usuario registrado con este correo.',
      };
    }

    // 2) Construir el nuevo usuario
    const now = new Date().toISOString();

    const newUser: User = {
      id: typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `user-${Date.now()}`,
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      email,
      password: payload.password, // En un backend real va un hash
      role: 'user',               // rol por defecto
      dateOfBirth: '',
      shippingAddress: '',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    // 3) Actualizar listado de usuarios
    this._users.update((list) => [...list, newUser]);

    // 4) Iniciar sesión automáticamente
    this._currentUser.set(newUser);

    // 5) Persistir sesión
    this.persistSession(newUser);

    return {
      success: true,
      message: 'Usuario registrado correctamente.',
    };
  }

  // ============================================================
  // 5) CRUD de usuarios (Admin + perfil)
  // ============================================================

  /**
   * Agrega un nuevo usuario a la lista.
   *
   * En un backend real esto debería ser un POST al servidor.
   *
   * @param newUser usuario completo a agregar
   */
  addUser(newUser: User): void {
    this._users.update((list) => [...list, newUser]);
  }

  /**
   * Actualiza los datos de un usuario existente.
   *
   * - Actualiza la lista general de usuarios.
   * - Si es el mismo usuario logueado, también actualiza `_currentUser`
   *   y persiste la sesión nueva.
   *
   * @param updated usuario con datos actualizados
   */
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

    // Si el usuario editado es el que está logueado, actualizamos sesión
    const current = this._currentUser();
    if (current && current.id === updated.id) {
      const merged = {
        ...current,
        ...updated,
      };
      this._currentUser.set(merged);
      this.persistSession(merged);
    }
  }

  /**
   * Elimina un usuario por ID.
   *
   * - Lo quita del listado general.
   * - Si es el usuario logueado, también hace logout y limpia sesión.
   *
   * @param id ID del usuario a eliminar
   */
  deleteUser(id: string): void {
    this._users.update((list) => list.filter((u) => u.id !== id));

    const current = this._currentUser();
    if (current?.id === id) {
      this._currentUser.set(null);
      this.clearSessionStorage();
    }
  }

  // ============================================================
  // 6) RECUPERAR CONTRASEÑA (demo)
  // ============================================================

  /**
   * Simula un flujo de recuperación de contraseña.
   *
   * En un backend real:
   * - se generaría un token temporal
   * - se enviaría un correo con un enlace de reseteo.
   *
   * @param email correo ingresado por el usuario
   * @returns objeto con success + message para UI
   */
  recoverPassword(email: string): { success: boolean; message: string } {
    const user = this._users().find(
      (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase(),
    );

    if (!user) {
      return {
        success: false,
        message: 'No encontramos un usuario con ese correo.',
      };
    }

    return {
      success: true,
      message:
        'Si el correo existe, te enviaremos instrucciones de recuperación.',
    };
  }

  // ============================================================
  // 7) MÉTODOS PRIVADOS PARA PERSISTIR / RESTAURAR SESIÓN
  // ============================================================

  /**
   * Guarda el usuario actual en localStorage junto a un token mock.
   *
   * @param user usuario que se quiere persistir
   */
  private persistSession(user: User): void {
    try {
      localStorage.setItem(this.STORAGE_USER_KEY, JSON.stringify(user));

      // Token mock (cuando exista backend, aquí va el JWT real).
      localStorage.setItem(this.STORAGE_TOKEN_KEY, 'mock-token-soundseeker');
    } catch (error) {
      console.error(
        '[AuthService] No se pudo guardar la sesión en localStorage',
        error,
      );
    }
  }

  /**
   * Intenta restaurar una sesión previa desde localStorage.
   * Se llama automáticamente en el constructor.
   */
  private restoreSession(): void {
    try {
      const storedUser = localStorage.getItem(this.STORAGE_USER_KEY);
      if (!storedUser) {
        return;
      }

      const user: User = JSON.parse(storedUser);

      if (user && user.id) {
        this._currentUser.set(user);
      }
    } catch (error) {
      console.error(
        '[AuthService] No se pudo restaurar la sesión desde localStorage',
        error,
      );
      this._currentUser.set(null);
    }
  }

  /**
   * Limpia el usuario y el token guardados en localStorage.
   * Usado en logout y cuando se elimina al usuario actual.
   */
  private clearSessionStorage(): void {
    try {
      localStorage.removeItem(this.STORAGE_USER_KEY);
      localStorage.removeItem(this.STORAGE_TOKEN_KEY);
    } catch (error) {
      console.error('[AuthService] No se pudo limpiar localStorage', error);
    }
  }
}
