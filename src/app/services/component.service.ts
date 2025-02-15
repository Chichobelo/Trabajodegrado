import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../enviroment/enviromen';
import { Stock } from '../interface/component.model';

@Injectable({
  providedIn: 'root',
})
export class ComponentsService {
  private baseUrl = environment.apiUrl+'/components';
  

  constructor(private http: HttpClient) {}

  getComponents(): Observable<Stock[]> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Stock[]>(this.baseUrl, { headers });
  }
  
  createComponent(component: Stock): Observable<any> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Stock>(this.baseUrl, component, { headers });
  }
  

  updateComponent(id: number | undefined, componentDetails: Stock): Observable<Stock> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<Stock>(`${this.baseUrl}/${id}`, componentDetails, { headers });
  }
  
  deleteComponent(id: number | undefined): Observable<void> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers });
  }
  
  
}
