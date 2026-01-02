import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Tema {
  idTema: number;
  idApunte: number;
  idTemaPadre: number | null;
  nombre: string;
}

@Injectable({ providedIn: 'root' })
export class TemaService {
  // Gateway apunta al microservicio de Apuntes
  private apiUrl = 'http://localhost:3000/apuntes';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // Backend: GET /apuntes/:idapunte/temas
  listarTemas(idApunte: number): Observable<Tema[]> {
    return this.http.get<Tema[]>(`${this.apiUrl}/${idApunte}/temas`, {
      headers: this.getHeaders()
    });
  }

  // Backend: POST /apuntes/temas
  insertarTema(tema: Partial<Tema>): Observable<Tema> {
    return this.http.post<Tema>(`${this.apiUrl}/temas`, tema, {
      headers: this.getHeaders()
    });
  }

  // Backend: PUT /apuntes/temas/:idtema
  modificarTema(tema: Tema): Observable<Tema> {
    return this.http.put<Tema>(`${this.apiUrl}/temas/${tema.idTema}`, tema, {
      headers: this.getHeaders()
    });
  }

  // Backend: DELETE /apuntes/temas/:idtema
  eliminarTema(idTema: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/temas/${idTema}`, {
      headers: this.getHeaders()
    });
  }
}