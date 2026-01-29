import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ServicioManteleria } from '../models/manteleriamodel';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'any'
})
export class ServManteleriaService {
  private jsonUrl =  "http://localhost:3000/manteleria";
  private servicios: ServicioManteleria[] = [];

  constructor(private http: HttpClient) {
    //this.cargarDatosIniciales();
  }

  // Obtener todos los servicios
  getServicios(): Observable<ServicioManteleria[]> {
    return this.http.get<ServicioManteleria[]>(this.jsonUrl)
    
  }

  // Obtener servicio por ID
  getServicio(id: number): Observable<ServicioManteleria | undefined> {
    const servicio = this.servicios.find(s => s.id === id);
    return of(servicio ? { ...servicio } : undefined);
  }

  // Crear nuevo servicio
  crearServicio(servicio: ServicioManteleria): Observable<ServicioManteleria> {
    const nuevoId = this.servicios.length > 0 
      ? Math.max(...this.servicios.map(s => s.id)) + 1 
      : 1;
    
    const nuevoServicio: ServicioManteleria = {
      ...servicio,
      id: nuevoId,
      fechaRegistro: new Date()
    };

    this.servicios.push(nuevoServicio);
    return of({ ...nuevoServicio });
  }

  // Actualizar servicio
  actualizarServicio(servicio: ServicioManteleria): Observable<ServicioManteleria> {
    const index = this.servicios.findIndex(s => s.id === servicio.id);
    
    if (index !== -1) {
      this.servicios[index] = { ...servicio };
      return of({ ...this.servicios[index] });
    }
    
    return of(servicio);
  }

  // Eliminar servicio
  eliminarServicio(id: number): Observable<boolean> {
    const initialLength = this.servicios.length;
    this.servicios = this.servicios.filter(s => s.id !== id);
    return of(this.servicios.length < initialLength);
  }

  // Buscar servicios
  buscarServicios(termino: string): Observable<ServicioManteleria[]> {
    if (!termino.trim()) {
      return this.getServicios();
    }
    
    const resultados = this.servicios.filter(servicio =>
      servicio.nombre.toLowerCase().includes(termino.toLowerCase()) ||
      servicio.descripcion.toLowerCase().includes(termino.toLowerCase()) ||
      servicio.color.toLowerCase().includes(termino.toLowerCase())
    );
    
    return of(resultados);
  }
}