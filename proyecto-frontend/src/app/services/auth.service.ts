import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // MODIFICADO: Apuntamos al Gateway en el path del microservicio de Auth
  private apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) { }

  login(correo: string, contrasena: string): Observable<any> {
    // MODIFICADO: Concatenamos '/login' para coincidir con la ruta del backend
    return this.http.post(`${this.apiUrl}/login`, { correo, contrasena });
  }

  logout() {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}