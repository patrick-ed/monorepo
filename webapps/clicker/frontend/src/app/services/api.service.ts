import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define interfaces for the data structures
export interface User {
  firstName: string;
  lastName: string;
  email: string;
}

export interface Clicks {
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_BASE_URL = '/api';

  constructor(private http: HttpClient) { }

  // User endpoints
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.API_BASE_URL}/user/me`);
  }

  // Clicks endpoints
  getClicks(): Observable<Clicks> {
    return this.http.get<Clicks>(`${this.API_BASE_URL}/clicks`);
  }

  incrementClicks(): Observable<Clicks> {
    return this.http.post<Clicks>(`${this.API_BASE_URL}/clicks/increment`, {});
  }

  resetClicks(): Observable<Clicks> {
    return this.http.post<Clicks>(`${this.API_BASE_URL}/clicks/reset`, {});
  }
}