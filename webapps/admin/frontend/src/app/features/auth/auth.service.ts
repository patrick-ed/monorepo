import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TokenService } from '../../core/services/token.service';
import { AuthCredentials } from './auth.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private apiUrl = '/api/v1/auth';

  private loggedInStatus = new BehaviorSubject<boolean>(!this.tokenService.isTokenExpired());

  /**
   * An observable that components subscribe to for real-time log in status.
   */
  isLoggedIn$: Observable<boolean> = this.loggedInStatus.asObservable();

  /**
   * Calls the login API endpoint.
   * On success, it saves the token and updates the authentication state.
   * @param credentials The user's username and password.
   * @returns An observable with the server's string response.
   */
  login(credentials: AuthCredentials): Observable<string> {
    const loginRequest = {
      username: credentials.username,
      password: credentials.password
    };
    // Note: The component will still handle the OTP flow. This service just initiates login.
    return this.http.post(`${this.apiUrl}/login`, loginRequest, { responseType: 'text' });
  }

  /**
   * To be called after the OTP is successfully verified.
   * This method stores the token and officially marks the user as logged in.
   * @param token The JWT received from the verify-otp endpoint.
   */
  finaliseLogin(token: string): void {
    this.tokenService.setToken(token);
    this.loggedInStatus.next(true);
  }

  /**
   * Logs the user out by clearing the token and updating the authentication state.
   */
  logout(): void {
    this.tokenService.removeToken();
    this.loggedInStatus.next(false);
  }

  isLoggedIn(): boolean {
    return !this.tokenService.isTokenExpired();
  }

  getUsername(): string {
    return this.tokenService.getUsername() ?? "";
  }
}