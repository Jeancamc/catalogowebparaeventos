import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Salon } from '../models/salon';

@Injectable({
  providedIn: 'root'
})
export class ServSalonesApi {
  // Asegúrate de que en db.json tengas "salones": [ ... ]
  private jsonUrl = 'http://localhost:5223/api/Salons';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Salon[]> {
    return this.http.get<Salon[]>(this.jsonUrl);
  }

  create(salon: Salon): Observable<Salon> {
    return this.http.post<Salon>(this.jsonUrl, salon);
  }

  update(salon: Salon): Observable<Salon> {
    if (!salon.id) {
      throw new Error('El salón a actualizar no tiene id');
    }
    return this.http.put<Salon>(`${this.jsonUrl}/${salon.id}`, salon);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.jsonUrl}/${id}`);
  }
}
