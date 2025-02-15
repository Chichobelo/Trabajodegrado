import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../interface/product.model';
import { environment } from '../enviroment/enviromen';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Base API URL - replace with your actual backend URL
    private baseUrl = environment.apiUrl+'/products';

  constructor(private http: HttpClient) {}

  createProduct(product: Product): Observable<Product> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Product>(this.baseUrl, product, { headers });
  }
  

  uploadImage(file: File, productId: number | undefined): Observable<Product> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const formData = new FormData();
    formData.append('file', file);
  
    return this.http.post<Product>(`${this.baseUrl}/upload/${productId}`, formData, { headers });
  }
  
  getAllProducts(): Observable<Product[]> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Product[]>(this.baseUrl, { headers });
  }
  

  getProductById(id: number): Observable<Product> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Product>(`${this.baseUrl}/${id}`, { headers });
  }
  

  updateProduct(id: number, product: Product): Observable<Product> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<Product>(`${this.baseUrl}/${id}`, product, { headers });
  }
  

  deleteProduct(id: number): Observable<void> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers });
  }
  
}