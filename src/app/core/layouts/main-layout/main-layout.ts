// src/app/core/layouts/main-layout/main-layout.ts

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

// Componentes compartidos que componen la estructura principal del sitio.
import { NavbarComponent } from '@shared/components/navbar/navbar';
import { FooterComponent } from '@shared/components/footer/footer';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css'],

  // Importo todo lo que necesita este layout para funcionar.
  // Este layout es básicamente la “capa principal” donde se renderizan
  // las diferentes páginas del proyecto.
  imports: [
    RouterOutlet,           // Aquí Angular coloca el contenido de cada ruta.
    NavbarComponent,        // Barra superior que aparece en todo el sitio.
    FooterComponent,        // Pie de página global.
    BreadcrumbComponent,    // Miga de pan para mostrar la navegación.
    CommonModule,           // Utilidades básicas (ngIf, ngFor, etc.).
  ],
})
export class MainLayout {
  // Este layout no necesita lógica interna.
  // Su único propósito es estructurar el header, breadcrumbs, contenido y footer.
  // Toda la dinámica depende de las rutas hijas y sus propios componentes.
}
