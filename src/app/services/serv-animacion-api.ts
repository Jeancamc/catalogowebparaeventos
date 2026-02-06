import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Animacion } from '../models/animacion';

@Injectable({
  providedIn: 'root',
})
export class ServAnimacionApi {
  // IMPORTANTE: en tu db.json (del json-server) debe existir "animacion": []
  private jsonUrl = 'http://localhost:5223/api/Animaciones';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(this.jsonUrl);
  }

  create(animacion: Animacion): Observable<any> {
    return this.http.post(this.jsonUrl, animacion);
  }

  update(animacion: Animacion): Observable<any> {
    if (!animacion.id) {
      throw new Error('La animación a actualizar no tiene id');
    }
    return this.http.put(`${this.jsonUrl}/${animacion.id}`, animacion);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.jsonUrl}/${id}`);
  }
}
