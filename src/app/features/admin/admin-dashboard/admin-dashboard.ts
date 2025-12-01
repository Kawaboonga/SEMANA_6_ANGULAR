// src/app/features/admin/admin-dashboard/admin-dashboard.ts

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
export class AdminDashboard {
  // ============================================================
  // 1) Inyección de servicios
  // ============================================================
  // AdminDataService: concentra datos de productos y usuarios internos del panel.
  private adminData = inject(AdminDataService);

  // TutorService: expone la lista de tutores (ya viene con signals).
  private tutorService = inject(TutorService);

  // ============================================================
  // 2) Fuentes de datos del dashboard (tutores / productos / usuarios)
  // ============================================================

  // TUTORES
  // El servicio de tutores ya expone un signal readonly → lo usamos directo.
  tutors = this.tutorService.tutors;

  // PRODUCTOS
  // AdminDataService NO usa signals, así que lo envolvemos con computed
  // para poder usarlo como si fuera reactivo en el template.
  products = computed(() => this.adminData.products);

  // USUARIOS ADMIN
  // Lo mismo: envolvemos la lista en un computed.
  users = computed(() => this.adminData.users);

  // ============================================================
  // 3) Indicadores de TUTORES (cards KPI)
  // ============================================================

  // Total de tutores registrados.
  totalTutores = computed(() => this.tutors().length);

  // Lista de tutores considerados “destacados” según rating.
  // Útil para mostrar un pequeño resumen o un listado compacto.
  destacadosTutores = computed(() =>
    this.tutors().filter((t) => t.rating >= 4.5),
  );

  // ============================================================
  // 4) Indicadores de PRODUCTOS
  // ============================================================

  // Cantidad total de productos administrados.
  totalProductos = computed(() => this.products().length);

  // Cantidad de productos activos que están marcados para aparecer en carruseles.
  productosEnCarrusel = computed(
    () => this.products().filter((p) => p.showInCarousel && p.isActive).length,
  );

  // ============================================================
  // 5) Indicadores de USUARIOS ADMIN
  // ============================================================

  // Total de usuarios internos (admin/editor/viewer) del panel.
  totalUsuarios = computed(() => this.users().length);
}
