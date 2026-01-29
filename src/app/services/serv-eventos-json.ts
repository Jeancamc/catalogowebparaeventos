// servicios/evento.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../models/evento';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private apiUrl = 'api/eventos';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}`);
  }

  getById(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.apiUrl}/${id}?includeDetails=true`);
  }

  create(evento: any): Observable<Evento> {
    return this.http.post<Evento>(this.apiUrl, evento);
  }

  update(id: number, evento: Evento): Observable<Evento> {
    return this.http.put<Evento>(`${this.apiUrl}/${id}`, evento);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getByCliente(email: string): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/cliente/${email}`);
  }

  getByEstado(estado: string): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/estado/${estado}`);
  }

  // Métodos adicionales
  confirmarEvento(id: number): Observable<Evento> {
    return this.http.patch<Evento>(`${this.apiUrl}/${id}/confirmar`, {});
  }

  cancelarEvento(id: number, motivo: string): Observable<Evento> {
    return this.http.patch<Evento>(`${this.apiUrl}/${id}/cancelar`, { motivo });
  }

  registrarPago(id: number, monto: number): Observable<Evento> {
    return this.http.patch<Evento>(`${this.apiUrl}/${id}/pago`, { monto });
  }
}