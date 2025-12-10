import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Decoracion } from '../models/deco';

@Injectable({
  providedIn: 'any',
})
export class ServDecoracionJson{
  private decoracionUrl = "http://localhost:3000/decoracion";
  
  
  constructor (private httpclient:HttpClient){
  }

  //Obtener las decoraciones
  getDecoracion(): Observable<Decoracion[]>{
    return this.httpclient.get<Decoracion[]>(this.decoracionUrl);
  }

 delete(id:number): Observable<void> {
  return this.httpclient.delete<void>(`${this.decoracionUrl}/${id}`);
}


  searchDecoracion(param:string) : Observable<Decoracion[]>{
    return this.httpclient.get<Decoracion[]>(this.decoracionUrl)
    .pipe(map(decoraciones=>decoraciones.filter(d=>d.nombre.toLowerCase().includes(param.toLowerCase()))))
  }

  update(decoracion:Decoracion):Observable<Decoracion>{
    let urlDecoracionEditar = `${this.decoracionUrl}/${decoracion.id}`;
    return this.httpclient.put<Decoracion>(urlDecoracionEditar, decoracion);
  }

  create(decoracion:Decoracion):Observable<Decoracion>{
    return this.httpclient.post<Decoracion>(this.decoracionUrl,decoracion);
  }



}
