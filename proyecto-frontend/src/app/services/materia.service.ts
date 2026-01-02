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
  // Agregamos este campo opcional porque el backend lo devuelve en "mis-cursos"
  // y lo necesitamos para identificar la inscripción.
  idUsuMat?: number; 
}

@Injectable({
  providedIn: 'root'
})
export class MateriaService {
  // Gateway apunta al microservicio de Cursos
  private apiUrl = 'http://localhost:3000/cursos';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // GET: Lista de todas las materias disponibles
  // Backend: GET /cursos/materias
  getMaterias(): Observable<Materia[]> {
    return this.http.get<Materia[]>(`${this.apiUrl}/materias`, {
      headers: this.getHeaders()
    });
  }

  // POST: Inscripción
  // Backend: POST /cursos/inscribir
  inscribirse(idMateria: number, clave: string) {
    // El backend espera "idmateria" en el body. La clave se envía pero el backend actual no la valida (según tu código),
    // pero la dejamos por si la implementas luego.
    return this.http.post(`${this.apiUrl}/inscribir`, { idmateria: idMateria, clave }, {
      headers: this.getHeaders()
    });
  }

  // GET: Lista de materias inscritas por el usuario
  // Backend: GET /cursos/mis-cursos
  getMisCursos(): Observable<Materia[]> {
    return this.http.get<Materia[]>(`${this.apiUrl}/mis-cursos`, {
      headers: this.getHeaders()
    });
  }
}