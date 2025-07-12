import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Artist, Paging, TrackDetails, UserProfile } from '../../models/spotify.model';
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
    return this.get<UserProfile>('me');
  }

  public getUserSavedTracks(
    limit: number = 20,
    offset: number = 0
  ): Observable<Paging<TrackDetails>> {
    return this.get<Paging<TrackDetails>>('me/tracks', { limit, offset });
  }

  public getUserTopItems(loadTopItemsInput: LoadTopItemsInput): Observable<Paging<Artist | TrackDetails>> {

    const defaultLimit = 20;
    const defaultOffset = 0;

    return this.get<Paging<Artist | TrackDetails>>(`me/top/${loadTopItemsInput.type}`, {
      time_range: loadTopItemsInput.timeRange,
      limit: loadTopItemsInput.limit || defaultLimit,
      offset: loadTopItemsInput.offset || defaultOffset,
    });
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

  private get<T>(endpoint: string, params?: { [param: string]: string | number }): Observable<T> {
    const url = `${this.API_BASE_URL}/${endpoint}`;

    return this.http.get<T>(url, {
      headers: this.getAuthHeaders(),
      params,
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.accessToken();
    if (!token) {
      throw new Error('Access token not available. Please log in.');
    }
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}
