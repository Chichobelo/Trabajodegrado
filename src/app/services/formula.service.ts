import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../enviroment/enviromen';
import { Formula } from '../interface/formula.model';
import { FormulaWithArrayDTO } from '../interface/formula-with-array-dto.model';

@Injectable({
  providedIn: 'root'
})
export class FormulaService {
  private baseUrl = `${environment.apiUrl}/formulas`;

  constructor(private http: HttpClient) {}

  createFormulaWithIngredients(
    formulaWithArrayDTO: FormulaWithArrayDTO
  ): Observable<any> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.baseUrl}/create-with-ingredients`, formulaWithArrayDTO, { headers });
  }
  
  getAllFormulasTransformed(): Observable<FormulaWithArrayDTO[]> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<FormulaWithArrayDTO[]>(`${this.baseUrl}/all-transformed`, { headers });
  }
  
  getAllFormulas(): Observable<Formula[]> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Formula[]>(`${this.baseUrl}/`, { headers });
  }
  

  deleteFormulasByProductId(productId: number): Observable<void> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl}/product/${productId}`;
    return this.http.delete<void>(url, { headers });
  }
  

  getFormulaById(id: number): Observable<Formula> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Formula>(`${this.baseUrl}/${id}`, { headers });
  }
  

  createFormula(formula: Formula): Observable<Formula> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Formula>(`${this.baseUrl}/create`, formula, { headers });
  }
  
  updateFormula(id: number, formula: Formula): Observable<Formula> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<Formula>(`${this.baseUrl}/${id}`, formula, { headers });
  }
  

  deleteFormula(id: number): Observable<void> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers });
  }
  getFormulasByProduct(productId: number): Observable<Formula[]> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Formula[]>(`${this.baseUrl}/product/${productId}`, { headers });
  }
  
  getFormulasByComponent(componentId: number): Observable<Formula[]> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Formula[]>(`${this.baseUrl}/component/${componentId}`, { headers });
  }
  
}
