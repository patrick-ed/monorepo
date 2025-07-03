import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { UserProfile } from '../../models/spotify.model';
import { ENV } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);

  constructor() {
    const token = localStorage.getItem('access_token');
    if (token) {
      this._accessToken.set(token);
    }
  }
  private readonly API_BASE_URL = ENV.SPOTIFY.BASE_URL;

  private _accessToken = signal<string | null>(null);
  public accessToken = this._accessToken.asReadonly();

  /**
   * Fetches the current user's profile from Spotify.
   * @returns An Observable of UserProfile containing user details.
   */
  public getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.API_BASE_URL}/me`, { headers: this.getAuthHeaders() });
  }

  /**
   * Logs user out by clearing the access token and removing it from local storage.
   * 
   */
  public logout(): void {
    this._accessToken.set(null);
    localStorage.removeItem('spotify_access_token');
  }

  public isAuthenticated(): boolean {
    return !!this.accessToken();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.accessToken();
    if (!token) {
      // TODO: Handle logout / refresh token logic here?
      throw new Error('Access token not available. Please log in.');
    }
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}
