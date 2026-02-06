// core/services/base-crud.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseCrudService<T> {
  protected http = inject(HttpClient);

  constructor(protected endpoint: string) {}

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.endpoint);
  }

  getById(id: number): Observable<T> {
    return this.http.get<T>(`${this.endpoint}/${id}`);
  }

  create(item: T): Observable<T> {
    return this.http.post<T>(this.endpoint, item);
  }

  update(item: any): Observable<T> {
    return this.http.put<T>(`${this.endpoint}/${item.id}`, item);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
