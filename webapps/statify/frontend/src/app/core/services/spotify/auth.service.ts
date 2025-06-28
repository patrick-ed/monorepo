import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ENV } from '../../../../environments/environment';
import { GeneralUtilsService } from '../utils/general-utils.service';
import { Observable, throwError, tap, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  constructor(private generalUtilsService: GeneralUtilsService) { }

  CLIENT_ID = ENV.SPOTIFY.CLIENT_ID;
  CLIENT_SECRET = ENV.SPOTIFY.CLIENT_SECRET;
  REDIRECT_URI = ENV.SPOTIFY.REDIRECT_URI;
  AUTH_URL = ENV.SPOTIFY.AUTH_URL;
  TOKEN_URL = ENV.SPOTIFY.TOKEN_URL;

  private getCodeVerifier() {
    return this.generalUtilsService.generateRandomString(64);
  }

  private async getCodeChallenge(codeVerifier: string): Promise<string> {
    const digest = await this.generalUtilsService.sha256(codeVerifier);
    const codeChallenge = this.generalUtilsService.base64UrlEncode(digest);
    return codeChallenge;
  }

  private getParams(codeChallenge: string): { [key: string]: string } {

    const scope = 'user-read-private user-read-email';
    return {
      response_type: 'code',
      client_id: this.CLIENT_ID,
      scope: scope,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      redirect_uri: this.REDIRECT_URI,
    }
  }

  redirectToSpotifyLogin() {
    const codeVerifier = this.getCodeVerifier();
    window.localStorage.setItem('code_verifier', codeVerifier);

    this.getCodeChallenge(codeVerifier).then((challenge) => {
      const params = this.getParams(challenge);
      const queryString = new URLSearchParams(params).toString();
      const authUrl = `${this.AUTH_URL}?${queryString}`;
      window.location.href = authUrl;
    }).catch((error) => {
      console.error('Error generating code challenge:', error);
    });
  }

  /**
   * Exchanges an authorization code for an access token.
   * @param code The authorization code returned from Spotify's initial auth.
   * @returns An Observable that emits the token response.
   */
  exchangeCodeForToken(code: string): Observable<TokenResponse> {
    const codeVerifier = localStorage.getItem('code_verifier');
    if (!codeVerifier) {
      return throwError(() => new Error('Code verifier not found in localStorage.'));
    }

    const body = new HttpParams()
      .set('client_id', this.CLIENT_ID)
      .set('grant_type', 'authorization_code')
      .set('code', code)
      .set('redirect_uri', this.REDIRECT_URI)
      .set('code_verifier', codeVerifier);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post<TokenResponse>(this.TOKEN_URL, body.toString(), { headers }).pipe(

      // Handle the response and store tokens in localStorage
      tap(response => {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
      }),
      // Handle errors
      catchError(error => {
        console.error("Error exchanging code for token:", error);
        return throwError(() => new Error('Failed to exchange code for token.'));
      })
    );
  }
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}
