import { TestBed } from '@angular/core/testing';

import { CarouselData } from './carousel-data';

describe('CarouselData', () => {
  let service: CarouselData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarouselData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
