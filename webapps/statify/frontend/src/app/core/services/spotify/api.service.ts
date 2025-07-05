import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { UserProfile } from '../../models/spotify.model';
import { ENV } from '../../../../environments/environment';
import { LoadTopItemsInput } from './inputs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);

  private readonly API_BASE_URL = ENV.SPOTIFY.BASE_URL;
  private _accessToken = signal<string | null>(null);
  public accessToken = this._accessToken.asReadonly();

  constructor() {
    this._accessToken.set(localStorage.getItem('access_token'));
  }

  /**
   * Fetches the current user's profile from Spotify.
   * @returns An Observable of UserProfile containing user details.
   */
  public getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.API_BASE_URL}/me`, {
      headers: this.getAuthHeaders(),
    });
  }

  public getUserSavedTracks(
    limit: number = 20,
    offset: number = 0
  ): Observable<any> {
    return this.http.get<UserProfile>(
      `${this.API_BASE_URL}/me/tracks?limit=${limit}&offset=${offset}`,
      { headers: this.getAuthHeaders() }
    );
  }

  public getUserTopItems(loadTopItemsInput: LoadTopItemsInput): Observable<any> {
    const { type, timeRange, limit = 20, offset = 0 } = loadTopItemsInput;
    return this.http.get<any>(
      `${this.API_BASE_URL}/me/top/${type}?time_range=${timeRange}&limit=${limit}&offset=${offset}`,
      { headers: this.getAuthHeaders() }
    );
  }

  /**
   * Logs user out by clearing the access token and removing it from local storage.
   *
   */
  public logout(): void {
    this._accessToken.set(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  public isAuthenticated(): boolean {
    return !!this.accessToken();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.accessToken();
    if (!token) {
      throw new Error('Access token not available. Please log in.');
    }
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}
