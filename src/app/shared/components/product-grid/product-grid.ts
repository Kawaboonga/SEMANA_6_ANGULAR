// ============================================================================
// PRODUCT GRID COMPONENT
// ----------------------------------------------------------------------------
// Componente presentacional ("dumb component") encargado únicamente de mostrar
// un grid de tarjetas de productos.
//
// - NO contiene lógica de filtrado, orden ni búsqueda.
// - Solo recibe un array de productos desde ProductListComponent.
// - Renderiza <app-product-card> por cada producto.
//
// Este patrón permite mantener una arquitectura clara:
//   ProductListComponent = componente inteligente (smart)
//   ProductGridComponent = componente visual (dumb)
// ============================================================================

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Product } from '@core/models/product.model';
import { ProductCardComponent } from '@shared/components/product-card/product-card';

@Component({
  selector: 'app-product-grid',
  standalone: true,

  // Importamos:
  // - CommonModule → directivas *ngIf, *ngFor
  // - ProductCardComponent → tarjeta individual de producto
  imports: [CommonModule, ProductCardComponent],

  templateUrl: './product-grid.html',
})
export class ProductGridComponent {

  // --------------------------------------------------------------------------
  // Input principal
  // --------------------------------------------------------------------------
  // Lista de productos ya filtrados, ordenados o buscados.
  // El componente NO modifica esta data, solo la muestra.
  @Input() products: Product[] = [];
}
