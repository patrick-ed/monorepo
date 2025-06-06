import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  public saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  public isLoggedIn(): boolean {
    return !!this.getToken();
  }

  public logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.router.navigate(['/login']);
  }
}