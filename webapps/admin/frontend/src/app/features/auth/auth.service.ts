import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthCredentials } from './auth.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/auth';
  constructor() { }

  
  login(credentials: AuthCredentials): Observable<string> {
    const loginRequest = {
      username: credentials.username,
      password: credentials.password
    };
    return this.http.post(`${this.apiUrl}/login`, loginRequest, { responseType: 'text' });
  }

}
