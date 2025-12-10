import { TestBed } from '@angular/core/testing';

import { ServMusicaJson } from './serv-musica-json';

describe('ServMusicaJson', () => {
  let service: ServMusicaJson;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServMusicaJson);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
