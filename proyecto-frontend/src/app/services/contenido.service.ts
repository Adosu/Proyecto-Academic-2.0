import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Contenido {
  idContenido: number;
  idTema: number;
  texto: string;
}

@Injectable({ providedIn: 'root' })
export class ContenidoService {
  // El Gateway redirige /apuntes al microservicio de Apuntes
  private apiUrl = 'http://localhost:3000/apuntes';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // Backend: GET /apuntes/temas/:idtema/contenidos
  listarContenidos(idTema: number): Observable<Contenido[]> {
    return this.http.get<Contenido[]>(`${this.apiUrl}/temas/${idTema}/contenidos`, {
      headers: this.getHeaders()
    });
  }

  // Backend: POST /apuntes/contenidos
  insertarContenido(data: Partial<Contenido>): Observable<Contenido> {
    return this.http.post<Contenido>(`${this.apiUrl}/contenidos`, data, {
      headers: this.getHeaders()
    });
  }

  // Backend: PUT /apuntes/contenidos/:idcontenido
  modificarContenido(data: { idContenido: number, texto: string }): Observable<Contenido> {
    return this.http.put<Contenido>(`${this.apiUrl}/contenidos/${data.idContenido}`, data, {
      headers: this.getHeaders()
    });
  }

  // Backend: DELETE /apuntes/contenidos/:idcontenido
  eliminarContenido(idContenido: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/contenidos/${idContenido}`, {
      headers: this.getHeaders()
    });
  }
}