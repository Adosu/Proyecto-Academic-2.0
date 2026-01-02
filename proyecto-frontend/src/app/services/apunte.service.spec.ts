import { TestBed } from '@angular/core/testing';

import { ApunteService } from './apunte.service';

describe('ApunteService', () => {
  let service: ApunteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApunteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
