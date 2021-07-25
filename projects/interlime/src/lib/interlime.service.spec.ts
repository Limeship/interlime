import { TestBed } from '@angular/core/testing';

import { InterlimeService } from './interlime.service';

describe('InterlimeService', () => {
  let service: InterlimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InterlimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
