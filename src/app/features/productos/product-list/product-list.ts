import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { ProductService } from '@core/services/product.service';
import { AuthService } from '@core/services/auth.service';
import { Product } from '@core/models/product.model';
import { ProductFilter } from '@core/models/product-filter.model';
import { ProductCategory } from '@core/models/product-category.model';

import { ProductCategoryBannerComponent } from '@shared/components/product-category-banner/product-category-banner';
import { ProductFiltersComponent } from '@shared/components/product-filters/product-filters';
import { ProductGridComponent } from '@shared/components/product-grid/product-grid';

import { ProductFormComponent } from '@shared/forms/product-form/product-form';

import { FadeUpDirective } from '@shared/directives/fade-up';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    ProductCategoryBannerComponent,
    ProductFiltersComponent,
    ProductGridComponent,
    ProductFormComponent,
    FadeUpDirective,
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductListComponent {
  // ============================================================
  // INYECCIONES
  // ============================================================

  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private authService = inject(AuthService);

  // ============================================================
  // ESTADO: FILTRO SECUNDARIO
  // ============================================================

  private _filter = signal<ProductFilter>({
    category: 'todos',
    sortBy: 'recent',
    condition: 'todos',
  });

  filter = this._filter.asReadonly();

  // ============================================================
  // ESTADO: CATEGORÍA PRINCIPAL (BANNER)
  // ============================================================

  bannerCategory = signal<ProductCategory | 'todos' | null>(null);

  // ============================================================
  // ADMIN: ¿ES ADMINISTRADOR?
  // ============================================================

  isAdmin = computed(() => this.authService.isAdmin());

  // ============================================================
  // ADMIN: FORM STATE (CREAR / EDITAR)
  // ============================================================

  showForm = signal(false);
  selectedProduct = signal<Product | null>(null);

  // ============================================================
  // LISTA FINAL DE PRODUCTOS (computed)
  // ============================================================

  products = computed(() => {
    // ✅ Usamos el computed del servicio (reactivo) y NO escribimos signals aquí
    let items = this.productService.filteredProducts();

    const cat = this.bannerCategory();
    if (cat && cat !== 'todos') {
      items = items.filter((p) => p.category === cat);
    }

    return items;
  });

  // ============================================================
  // CONSTRUCTOR → sincronizar URL con filtros
  // ============================================================

  constructor() {
    // Inicializa el filtro del servicio (modo reactivo correcto)
    this.productService.setFilter(this._filter());

    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug') as ProductCategory | 'todos' | null;

      if (slug && slug !== 'todos') {
        this.bannerCategory.set(slug);
        this._filter.update((current) => ({
          ...current,
          category: slug,
        }));
      } else {
        this.bannerCategory.set(null);
        this._filter.update((current) => ({
          ...current,
          category: 'todos',
        }));
      }

      // ✅ Actualizar filtro del servicio fuera del computed
      this.productService.setFilter(this._filter());
    });
  }

  // ============================================================
  // EVENTOS DESDE COMPONENTES HIJOS (FILTROS / BANNER)
  // ============================================================

  onFilterChange(partial: Partial<ProductFilter>) {
    this._filter.update((current) => ({ ...current, ...partial }));
    this.productService.setFilter(this._filter());
  }

  onBannerCategoryChange(cat: ProductCategory | 'todos' | null) {
    this.bannerCategory.set(cat);

    this._filter.update((current) => ({
      ...current,
      category: cat ?? 'todos',
    }));

    this.productService.setFilter(this._filter());
  }

  onClearAll() {
    this._filter.set({
      category: 'todos',
      sortBy: 'recent',
      condition: 'todos',
    });

    this.bannerCategory.set(null);
    this.productService.setFilter(this._filter());
  }

  // ============================================================
  // ADMIN: CRUD DESDE LA VISTA PÚBLICA (CARDS)
  // ============================================================

  onAdminCreate() {
    if (!this.isAdmin()) return;

    this.selectedProduct.set(null);
    this.showForm.set(true);
  }

  onAdminEdit(productId: string) {
    if (!this.isAdmin()) return;

    const found =
      this.productService.getAll().find((p) => p.id === productId) ?? null;

    this.selectedProduct.set(found);
    this.showForm.set(true);
  }

  onAdminDelete(productId: string) {
    if (!this.isAdmin()) return;

    // La confirmación se hace en la card (como tú lo implementaste)
    this.productService.deleteById(productId);
  }

  onAdminSave(product: Product) {
    if (!this.isAdmin()) return;

    // Si existe -> update, si no -> create
    const exists = this.productService.getAll().some((p) => p.id === product.id);

    if (exists) this.productService.update(product);
    else this.productService.create(product);

    this.showForm.set(false);
    this.selectedProduct.set(null);
  }

  onAdminCancel() {
    this.showForm.set(false);
    this.selectedProduct.set(null);
  }
}
