import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioMateriaService {
  // Gateway apunta al microservicio de Cursos
  private apiUrl = 'http://localhost:3000/cursos';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  desinscribirse(idMateria: number): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/mis-cursos`, { headers: this.getHeaders() }).pipe(
      switchMap(cursos => {
        const inscripcion = cursos.find(c => c.idMateria == idMateria);

        if (!inscripcion) {
          return throwError(() => new Error('No se encontró la inscripción para esta materia.'));
        }
        return this.http.delete(`${this.apiUrl}/desinscribir/${inscripcion.idUsuMat}`, {
          headers: this.getHeaders()
        });
      })
    );
  }
}