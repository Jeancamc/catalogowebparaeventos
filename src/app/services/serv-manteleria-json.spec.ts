import { TestBed } from '@angular/core/testing';

import { ServManteleriaService } from './serv-manteleria-api';

describe('ServManteleriaApi', () => {
  let service: ServManteleriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServManteleriaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
