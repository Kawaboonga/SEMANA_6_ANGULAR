
import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminDataService } from '@core/services/admin-data.service';
import { TutorService } from '@core/services/tutor.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
})
/**
 * Dashboard principal del panel de administración.
 *
 * Este componente muestra indicadores globales del sistema:
 * - Cantidad total de tutores
 * - Productos cargados y activos en carruseles
 * - Usuarios internos del panel (admin/editor/viewer)
 *
 * Se apoya en dos servicios:
 * - `TutorService` → ya expone signals reactivos.
 * - `AdminDataService` → arrays simples envueltos en `computed()` para
 *   poder actualizarlos de forma reactiva en el template.
 *
 * No contiene lógica de CRUD, solo lectura y métricas.
 */
export class AdminDashboard {

  // ============================================================
  // 1) Inyección de servicios
  // ============================================================

  /** Servicio con datos de productos y usuarios internos del panel admin. */
  private adminData = inject(AdminDataService);

  /** Servicio que entrega la lista de tutores (usa signals). */
  private tutorService = inject(TutorService);

  // ============================================================
  // 2) Fuentes de datos del dashboard
  // ============================================================

  /**
   * Lista reactiva de tutores.
   * Viene como signal readonly desde `TutorService`.
   */
  tutors = this.tutorService.tutors;

  /**
   * Lista de productos administrados.
   * `AdminDataService` no usa signals, así que lo envuelvo en computed()
   * para que el template pueda reaccionar automáticamente a los cambios.
   */
  products = computed(() => this.adminData.products);

  /**
   * Lista de usuarios internos (admin/editor/viewer).
   * También envuelto en computed() por las mismas razones.
   */
  users = computed(() => this.adminData.users);

  // ============================================================
  // 3) Indicadores de TUTORES
  // ============================================================

  /**
   * Total de tutores registrados en el sistema.
   * Se usa en la card "Tutores" del dashboard.
   */
  totalTutores = computed(() => this.tutors().length);

  /**
   * Tutores con buen rendimiento (rating ≥ 4.5).
   * Útil para un pequeño “top” o panel lateral del dashboard.
   */
  destacadosTutores = computed(() =>
    this.tutors().filter((t) => t.rating >= 4.5),
  );

  // ============================================================
  // 4) Indicadores de PRODUCTOS
  // ============================================================

  /**
   * Total de productos administrados.
   * Representa todos los cargados a través del panel /admin.
   */
  totalProductos = computed(() => this.products().length);

  /**
   * Cantidad de productos activos marcados para aparecer en el carrusel.
   * Se usa para ver cuánta oferta está destacada visualmente en el sitio.
   */
  productosEnCarrusel = computed(() =>
    this.products().filter((p) => p.showInCarousel && p.isActive).length,
  );

  // ============================================================
  // 5) Indicadores de USUARIOS ADMIN
  // ============================================================

  /**
   * Total de usuarios internos del panel:
   * - admin
   * - editor
   * - viewer
   *
   * Esto NO es lo mismo que los usuarios del sitio (AuthService).
   */
  totalUsuarios = computed(() => this.users().length);
}
