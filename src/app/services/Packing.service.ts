import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Packing } from '../interface/Packing.model';
import { environment } from '../enviroment/enviromen';

@Injectable({
  providedIn: 'root',
})
export class PackingService {
  private baseUrl = environment.apiUrl + '/packings';

  constructor(private http: HttpClient) {}

  // Obtener todos los packings
  getAllPackings(): Observable<Packing[]> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Packing[]>(this.baseUrl, { headers });
  }

  // Obtener un packing por su ID
  getPackingById(id: number): Observable<Packing> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Packing>(`${this.baseUrl}/${id}`, { headers });
  }

  /**
   * Crea un nuevo packing
   * @param packing Objeto Packing a crear
   */
  createPacking(packing: Packing[]): Observable<Packing[]> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Packing[]>(this.baseUrl, packing, { headers });
  }

  /**
   * Actualiza un packing existente
   * @param id ID del packing
   * @param packing Objeto Packing con los nuevos datos
   */
  updatePacking(id: number, packing: Packing): Observable<Packing> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<Packing>(`${this.baseUrl}/${id}`, packing, { headers });
  }

  /**
   * Elimina un packing por su ID
   * @param id ID del packing
   */
  deletePacking(id: number): Observable<void> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers });
  }
}
