import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorFilterBar } from './tutor-filter-bar';

describe('TutorFilterBar', () => {
  let component: TutorFilterBar;
  let fixture: ComponentFixture<TutorFilterBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutorFilterBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorFilterBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
