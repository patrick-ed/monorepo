// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) { }

  loginWithGoogle(token: string): Observable<any> {
    return this.http.post('/api/login', { credential: token });
  }

  setUser(user: any): void {
    this.userSubject.next(user);
  }

  getUser(): any {
    return this.userSubject.value;
  }
}