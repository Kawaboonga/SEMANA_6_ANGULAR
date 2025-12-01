// =============================================================================
// Componente: AdBanner
// Ubicación: src/app/shared/components/ad-banner/ad-banner.ts
// -----------------------------------------------------------------------------
// Este componente es un "banner publicitario" o bloque promocional reutilizable.
//
// • Es un componente standalone (Angular 20).
// • No recibe @Input() todavía, pero está listo para aceptar datos dinámicos.
// • Usa un template y un estilo propio.
// • Su propósito es mostrar un bloque visual destacado dentro del sitio.
//
// Puedes extenderlo para permitir:
//   - Imágenes dinámicas
//   - Links a productos o servicios
//   - Variantes visuales (oscuro, claro, compacto)
//   - Adaptación a distintos tamaños
//
// Por ahora, solo renderiza el contenido del HTML.
// =============================================================================

import { Component } from '@angular/core';

@Component({
  selector: 'app-ad-banner',
  standalone: true,      // 💡 Importante: componente standalone
  imports: [],           // No usa otros componentes/directivas todavía
  templateUrl: './ad-banner.html',
  styleUrl: './ad-banner.css',
})
export class AdBanner {
  // ---------------------------------------------------------------------------
  // Lógica del componente:
  // (Vacío por ahora)
  //
  // Si en el futuro quieres agregar:
  //   @Input() title: string;
  //   @Input() imageUrl: string;
  //   @Input() link: string;
  //   etc…
  //
  // …este componente está listo para crecer sin romper nada.
  // ---------------------------------------------------------------------------
}
