import { TestBed } from '@angular/core/testing';

import { ServDecoracionJson } from './serv-decoracion-json';

describe('ServDecoracionJson', () => {
  let service: ServDecoracionJson;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServDecoracionJson);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
