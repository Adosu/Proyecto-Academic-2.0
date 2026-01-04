import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Materia {
  idMateria: number;
  nombreMateria: string;
  cursoParalelo: string;
  nombreDocente: string;
  horario: string;
  imagenUrl: string;
  idUsuMat?: number; 
}

@Injectable({
  providedIn: 'root'
})
export class MateriaService {
  private apiUrl = 'http://localhost:3000/cursos';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getMaterias(): Observable<Materia[]> {
    return this.http.get<Materia[]>(`${this.apiUrl}/materias`, {
      headers: this.getHeaders()
    });
  }

  inscribirse(idMateria: number, clave: string) {
    return this.http.post(`${this.apiUrl}/inscribir`, { idmateria: idMateria, clave }, {
      headers: this.getHeaders()
    });
  }

  getMisCursos(): Observable<Materia[]> {
    return this.http.get<Materia[]>(`${this.apiUrl}/mis-cursos`, {
      headers: this.getHeaders()
    });
  }
}