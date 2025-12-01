import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursoDetail } from './curso-detail';

describe('CursoDetail', () => {
  let component: CursoDetail;
  let fixture: ComponentFixture<CursoDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CursoDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CursoDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
