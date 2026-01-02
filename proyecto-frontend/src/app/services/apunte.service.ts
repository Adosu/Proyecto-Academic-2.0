import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export interface Apunte {
  idApunte: number;
  idUsuMat: number;
  titulo: string;
  resumen: string;
  fecha: string;
}

@Injectable({ providedIn: 'root' })
export class ApunteService {
  // URL del Gateway para Apuntes
  private apiUrl = 'http://localhost:3000/apuntes';
  // URL del Gateway para Cursos (necesaria para traducir idMateria -> idUsuMat)
  private cursosUrl = 'http://localhost:3000/cursos';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // MODIFICADO: Traduce idMateria -> idUsuMat antes de llamar al microservicio
  listarApuntes(idMateria: number): Observable<Apunte[]> {
    return this.http.get<any[]>(`${this.cursosUrl}/mis-cursos`, { headers: this.getHeaders() }).pipe(
      switchMap(cursos => {
        // Buscamos la inscripción correspondiente a la materia solicitada
        // (Usamos '==' para evitar problemas de tipos string/number)
        const curso = cursos.find(c => c.idMateria == idMateria);

        if (!curso) {
          return throwError(() => new Error('No estás inscrito en esta materia o no se encontró la inscripción (idUsuMat).'));
        }

        // Llamamos al microservicio de Apuntes con el idUsuMat correcto
        // Ruta Backend: GET /apuntes/:idusumat
        return this.http.get<Apunte[]>(`${this.apiUrl}/${curso.idUsuMat}`, {
          headers: this.getHeaders()
        });
      })
    );
  }

  // MODIFICADO: Obtiene idUsuMat y luego inserta
  insertarApunte(apunte: Partial<Apunte>, idMateria: number): Observable<Apunte> {
    return this.http.get<any[]>(`${this.cursosUrl}/mis-cursos`, { headers: this.getHeaders() }).pipe(
      switchMap(cursos => {
        const curso = cursos.find(c => c.idMateria == idMateria);
        
        if (!curso) {
           return throwError(() => new Error('Error al crear apunte: Materia no encontrada.'));
        }

        // Construimos el objeto con idusumat (que es lo que espera el backend)
        const payload = { ...apunte, idusumat: curso.idUsuMat };

        // Ruta Backend: POST /apuntes/
        return this.http.post<Apunte>(`${this.apiUrl}/`, payload, {
          headers: this.getHeaders()
        });
      })
    );
  }

  // MODIFICADO: Ruta REST PUT /apuntes/:id
  modificarApunte(apunte: Apunte): Observable<Apunte> {
    return this.http.put<Apunte>(`${this.apiUrl}/${apunte.idApunte}`, apunte, {
      headers: this.getHeaders()
    });
  }

  // MODIFICADO: Ruta REST DELETE /apuntes/:id
  eliminarApunte(idApunte: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${idApunte}`, {
      headers: this.getHeaders()
    });
  }
}