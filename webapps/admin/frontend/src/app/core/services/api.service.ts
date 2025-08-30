import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);

  // This function calls the backend and expects a plain text response
  pingBackend(): Observable<string> {
    return this.http.get('/api/v1/ping', { responseType: 'text' });
  }
}