import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);

  // This function calls the backend and expects a plain text response
  serverStatus(): Observable<string> {
    return this.http.get('/api/v1/status', { responseType: 'text' });
  }
}