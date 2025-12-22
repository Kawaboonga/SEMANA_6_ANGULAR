import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { ProductService } from './product.service';
import { Product } from '@core/models/product.model';
import { PRODUCTS_MOCK } from '@core/mocks/products.mock';
import { STORAGE_KEYS } from '@core/constants/storage-keys';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    // Importante: limpiar antes de instanciar el servicio
    localStorage.clear();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);

    // Responder la carga inicial del JSON remoto para que el servicio tenga datos
    const req = httpMock.expectOne('/JSON_API/products.json');
    req.flush(PRODUCTS_MOCK);
  });

  afterEach(() => {
    // Verifica que no queden requests pendientes
    httpMock.verify();
  });

  /**
   * =====================================================
   * PRUEBA 1
   * Carga inicial de productos
   * =====================================================
   */
  it('debería inicializar el servicio con productos', () => {
    const products = service.products();

    expect(products).toBeDefined();
    expect(products.length).toBeGreaterThan(0);
  });

  /**
   * =====================================================
   * PRUEBA 2
   * Obtener un producto por ID (sin getById)
   * =====================================================
   */
  it('debería retornar un producto existente buscándolo por id desde la lista', () => {
    // Arrange
    const products = service.products();
    const productId = products[0].id;

    // Act (sin getById)
    const product = service.products().find((p) => p.id === productId);

    // Assert
    expect(product).toBeDefined();
    expect(product?.id).toBe(productId);
  });

  /**
   * =====================================================
   * PRUEBA 3
   * Obtener un producto por slug (método real del servicio)
   * =====================================================
   */
  it('debería retornar un producto existente por su slug', () => {
    // Arrange
    const product = service.products()[0];

    // Aseguramos que el slug exista (TypeScript strict)
    expect(product.slug).toBeDefined();

    // Act
    const result = service.getBySlug(product.slug!);

    // Assert
    expect(result).toBeDefined();
    expect(result?.slug).toBe(product.slug);
    expect(result?.id).toBe(product.id);
  });

  /**
   * =====================================================
   * PRUEBA 4
   * Crear un producto nuevo
   * =====================================================
   */
  it('debería agregar un nuevo producto al listado', () => {
    // Arrange
    const initialCount = service.products().length;

    const newProduct: Product = {
      id: 'test-001',
      slug: 'producto-de-prueba',
      name: 'Producto de prueba',
      description: 'Producto creado desde una prueba unitaria',
      category: 'guitarras',
      price: 500000,
      condition: 'nuevo',
      modality: 'venta',
      isActive: true,
      // flags opcionales según tu modelo
      isOffer: false,
      isFeatured: false,
      isNew: false,
      showInCarousel: false,
    };

    // Act
    service.create(newProduct);

    // Assert
    const products = service.products();
    expect(products.length).toBe(initialCount + 1);
    expect(products.some((p) => p.id === newProduct.id)).toBeTrue();
  });

  /**
   * =====================================================
   * PRUEBA 5
   * Actualizar un producto existente
   * =====================================================
   */
  it('debería actualizar los datos de un producto existente', () => {
    // Arrange
    const product = service.products()[0];
    const updatedProduct: Product = {
      ...product,
      price: product.price + 10000,
      isOffer: true,
    };

    // Act
    service.update(updatedProduct);

    // Assert (sin getById)
    const result = service.products().find((p) => p.id === product.id);
    expect(result).toBeDefined();
    expect(result?.price).toBe(updatedProduct.price);
    expect(result?.isOffer).toBeTrue();
  });

  /**
   * =====================================================
   * PRUEBA 6
   * Eliminar un producto por ID (método real deleteById)
   * =====================================================
   */
  it('debería eliminar un producto del listado', () => {
    // Arrange
    const product = service.products()[0];
    const initialCount = service.products().length;

    // Act
    service.deleteById(product.id);

    // Assert
    const products = service.products();
    expect(products.length).toBe(initialCount - 1);
    expect(products.find((p) => p.id === product.id)).toBeUndefined();
  });

  /**
   * =====================================================
   * EXTRA (recomendado)
   * Persistencia en localStorage
   * =====================================================
   */
  it('debería guardar los productos en localStorage al modificarlos', () => {
    // Arrange
    const newProduct: Product = {
      id: 'persist-001',
      slug: 'producto-persistido',
      name: 'Producto persistido',
      description: 'Producto guardado en localStorage',
      category: 'pedales',
      price: 120000,
      modality: 'venta',
      isActive: true,
      isOffer: false,
      isFeatured: false,
      isNew: false,
      showInCarousel: false,
    };

    // Act
    service.create(newProduct);

    // Assert
    const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    expect(stored).not.toBeNull();

    const parsed = JSON.parse(stored!);
    expect(parsed.some((p: Product) => p.id === newProduct.id)).toBeTrue();
  });
});
