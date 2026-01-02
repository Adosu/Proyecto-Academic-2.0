import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  idUsuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  contrasena?: string;
  estado?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  // Gateway apunta al microservicio de Auth
  private apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // Obtener perfil autenticado
  // Backend: GET /auth/me
  getPerfil(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/me`, {
      headers: this.getHeaders()
    });
  }

  // Registrar nuevo usuario (ruta pública sin token)
  // Backend: POST /auth/register
  registrarUsuario(usuario: Partial<Usuario>): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/register`, usuario);
  }

  // Modificar usuario autenticado
  // Backend: PUT /auth/update
  modificarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/update`, usuario, {
      headers: this.getHeaders()
    });
  }

  // Eliminar usuario autenticado
  // Backend: DELETE /auth/delete
  eliminarUsuario(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete`, {
      headers: this.getHeaders()
    });
  }
}