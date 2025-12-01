import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursosList } from './cursos-list';

describe('CursosList', () => {
  let component: CursosList;
  let fixture: ComponentFixture<CursosList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CursosList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CursosList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
