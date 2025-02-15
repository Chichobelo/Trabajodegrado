import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../enviroment/enviromen';
import { Location } from '../interface/location.model';


@Injectable({
  providedIn: 'root'
})
export class LocationService {
    private baseUrl = environment.apiUrl+'/locations';

  constructor(private http: HttpClient) { }

  // Get all locations
  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(this.baseUrl);
  }

  // Get location by ID
  getLocationById(id: number): Observable<Location> {
    return this.http.get<Location>(`${this.baseUrl}/${id}`);
  }

  // Create a new location
  createLocation(location: Location): Observable<Location> {
    return this.http.post<Location>(this.baseUrl, location);
  }

  // Update an existing location
  updateLocation(location: Location): Observable<Location> {
    return this.http.put<Location>(`${this.baseUrl}/${location.idlocation}`, location);
  }

  // Delete a location
  deleteLocation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}