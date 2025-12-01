import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticiasDetail } from './noticias-detail';

describe('NoticiasDetail', () => {
  let component: NoticiasDetail;
  let fixture: ComponentFixture<NoticiasDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticiasDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticiasDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
