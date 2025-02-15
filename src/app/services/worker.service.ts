import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../enviroment/enviromen';
import { Worker } from '../interface/worker.model';

@Injectable({
  providedIn: 'root'
})
export class WorkerService {
    private baseUrl = environment.apiUrl+'/workers';

  constructor(private http: HttpClient) { }

  // Get all workers
  getWorkers(): Observable<Worker[]> {
    return this.http.get<Worker[]>(this.baseUrl);
  }

  // Get worker by ID
  getWorkerById(id: number): Observable<Worker> {
    return this.http.get<Worker>(`${this.baseUrl}/${id}`);
  }

  // Create a new worker
  createWorker(worker: Worker): Observable<Worker> {
    return this.http.post<Worker>(this.baseUrl, worker);
  }

  // Update an existing worker
  updateWorker(worker: Worker): Observable<Worker> {
    return this.http.put<Worker>(`${this.baseUrl}/${worker.idworker}`, worker);
  }

  // Delete a worker
  deleteWorker(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}