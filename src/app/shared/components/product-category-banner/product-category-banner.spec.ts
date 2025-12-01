import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCategoryBanner } from './product-category-banner';

describe('ProductCategoryBanner', () => {
  let component: ProductCategoryBanner;
  let fixture: ComponentFixture<ProductCategoryBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCategoryBanner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCategoryBanner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
