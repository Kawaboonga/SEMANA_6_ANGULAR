import { TestBed } from '@angular/core/testing';

import { Tutor } from './tutor.service';

describe('Tutor', () => {
  let service: Tutor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Tutor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
