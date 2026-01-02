import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecordatorioService {
  // Gateway apunta al microservicio de Recordatorios
  private baseUrl = 'http://localhost:3000/recordatorios';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // Backend: GET /recordatorios/
  getRecordatorios(): Observable<Recordatorio[]> {
    return this.http.get<Recordatorio[]>(`${this.baseUrl}/`, { headers: this.getHeaders() });
  }

  // Backend: POST /recordatorios/
  insertarRecordatorio(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/`, data, { headers: this.getHeaders() });
  }

  // Backend: PUT /recordatorios/:idrecordatorio
  modificarRecordatorio(data: any): Observable<any> {
    // Extraemos el ID del objeto para ponerlo en la URL
    return this.http.put(`${this.baseUrl}/${data.idRecordatorio}`, data, { headers: this.getHeaders() });
  }

  // Backend: DELETE /recordatorios/:idrecordatorio
  eliminarRecordatorio(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
}

export interface Recordatorio {
  idRecordatorio: number;
  idUsuario: number;
  fechaLimite: string;
  hora: string;
  titulo: string;
  descripcion: string;
  estado: string;
  fechaRegistro: string;
}