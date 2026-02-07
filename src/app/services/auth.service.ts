// services/auth.service.ts

import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  constructor() {}
  private router = inject(Router);

  private apiUrl = 'http://localhost:5223/api/Auth';
  private tokenKey = 'eventos_token';

  // Para saber si el usuario está logueado
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // Para obtener datos del usuario
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        // Guardar token y datos
        localStorage.setItem(this.tokenKey, response.token);
        localStorage.setItem('user_email', response.email);
        localStorage.setItem('user_name', response.nombre);
        localStorage.setItem('user_role', response.rol);

        this.isAuthenticatedSubject.next(true);
        this.userSubject.next({
          email: response.email,
          nombre: response.nombre,
          rol: response.rol,
        });
      }),
    );
  }

  register(email: string, nombre: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, nombre, password });
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_role');

    this.isAuthenticatedSubject.next(false);
    this.userSubject.next(null);

    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserRole(): string | null {
    return localStorage.getItem('user_role');
  }

  getUserName(): string | null {
    return localStorage.getItem('user_name');
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  // Verificar si el token ha expirado (simple)
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    // Decodificar el token JWT (parte simple)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}
