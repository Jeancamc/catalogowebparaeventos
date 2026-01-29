import { TestBed } from '@angular/core/testing';

import { EventoService } from './serv-eventos-json';

describe('ServEventosJson', () => {
  let service: EventoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
