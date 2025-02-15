import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PackagingType } from '../interface/PackagingType.model';
import { environment } from '../enviroment/enviromen';

@Injectable({
  providedIn: 'root',
})
export class PackagingTypeService {
  private baseUrl = environment.apiUrl + '/packaging-types';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los tipos de empaque
   */
  getAllPackagingTypes(): Observable<PackagingType[]> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<PackagingType[]>(this.baseUrl, { headers });
  }

  /**
   * Obtiene un tipo de empaque por su ID
   * @param id ID del tipo de empaque
   */
  getPackagingTypeById(id: number): Observable<PackagingType> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<PackagingType>(`${this.baseUrl}/${id}`, { headers });
  }

  /**
   * Crea un nuevo tipo de empaque
   * @param packagingType Objeto PackagingType a crear
   */
  createPackagingType(packagingType: PackagingType): Observable<PackagingType> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<PackagingType>(this.baseUrl, packagingType, { headers });
  }

  /**
   * Actualiza un tipo de empaque existente
   * @param id ID del tipo de empaque
   * @param packagingType Objeto PackagingType con los nuevos datos
   */
  updatePackagingType(id: number, packagingType: PackagingType): Observable<PackagingType> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<PackagingType>(`${this.baseUrl}/${id}`, packagingType, { headers });
  }

  /**
   * Elimina un tipo de empaque por su ID
   * @param id ID del tipo de empaque
   */
  deletePackagingType(id: number): Observable<void> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers });
  }
}
