import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicioDetail } from './servicio-detail';

describe('ServicioDetail', () => {
  let component: ServicioDetail;
  let fixture: ComponentFixture<ServicioDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicioDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicioDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
