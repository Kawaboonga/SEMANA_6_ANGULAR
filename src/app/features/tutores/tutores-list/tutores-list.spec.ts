import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoresList } from './tutores-list';

describe('TutoresList', () => {
  let component: TutoresList;
  let fixture: ComponentFixture<TutoresList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutoresList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutoresList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
