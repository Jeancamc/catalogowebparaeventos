import { TestBed } from '@angular/core/testing';

import { ServMusicaApi } from './serv-musica-api';

describe('ServMusicaJson', () => {
  let service: ServMusicaApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServMusicaApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
