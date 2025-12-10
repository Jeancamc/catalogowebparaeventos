import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Musica } from '../models/musica';

@Injectable({
  providedIn: 'root'
})
export class ServMusicaJson {
  private jsonUrl = 'http://localhost:3000/musica';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Musica[]> {
    return this.http.get<Musica[]>(this.jsonUrl);
  }

  create(musica: Musica): Observable<Musica> {
    return this.http.post<Musica>(this.jsonUrl, musica);
  }

  update(musica: Musica): Observable<Musica> {
    return this.http.put<Musica>(`${this.jsonUrl}/${musica.id}`, musica);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.jsonUrl}/${id}`);
  }

  search(param: string): Observable<Musica[]> {
    return this.http.get<Musica[]>(`${this.jsonUrl}?nombre_like=${param}`);
  }
}