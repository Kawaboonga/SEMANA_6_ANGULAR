import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTutores } from './admin-tutores';

describe('AdminTutores', () => {
  let component: AdminTutores;
  let fixture: ComponentFixture<AdminTutores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTutores]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTutores);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
