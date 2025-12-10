import { TestBed } from '@angular/core/testing';

import { ServManteleriaJson } from './serv-manteleria-json';

describe('ServManteleriaJson', () => {
  let service: ServManteleriaJson;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServManteleriaJson);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
