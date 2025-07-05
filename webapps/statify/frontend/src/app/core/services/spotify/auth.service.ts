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
  private generalUtilsService = inject(GeneralUtilsService);

  private readonly CLIENT_ID = ENV.SPOTIFY.CLIENT_ID;
  private readonly REDIRECT_URI = ENV.SPOTIFY.REDIRECT_URI;
  private readonly AUTH_URL = ENV.SPOTIFY.AUTH_URL;
  private readonly TOKEN_URL = ENV.SPOTIFY.TOKEN_URL;
  private readonly SCOPE = 'user-read-private user-read-email user-library-read';

  private getCodeVerifier(): string {
    return this.generalUtilsService.generateRandomString(64);
  }

  private async getCodeChallenge(codeVerifier: string): Promise<string> {
    const digest = await this.generalUtilsService.sha256(codeVerifier);
    return this.generalUtilsService.base64UrlEncode(digest);
  }

  async redirectToSpotifyLogin(): Promise<void> {
    const codeVerifier = this.getCodeVerifier();
    localStorage.setItem('code_verifier', codeVerifier);

    try {
      const codeChallenge = await this.getCodeChallenge(codeVerifier);
      const params = new HttpParams({
        fromObject: {
          response_type: 'code',
          client_id: this.CLIENT_ID,
          scope: this.SCOPE,
          code_challenge_method: 'S256',
          code_challenge: codeChallenge,
          redirect_uri: this.REDIRECT_URI,
        },
      });

      window.location.href = `${this.AUTH_URL}?${params.toString()}`;
    } catch (error) {
      console.error('Error generating code challenge:', error);
    }
  }

  /**
   * Exchanges an authorization code for an access token.
   * @param code The authorization code returned from Spotify's initial auth.
   * @returns An Observable that emits the token response.
   */
  exchangeCodeForToken(code: string): Observable<TokenResponse> {
    const codeVerifier = localStorage.getItem('code_verifier');
    if (!codeVerifier) {
      return throwError(
        () => new Error('Code verifier not found in localStorage.')
      );
    }

    const body = new HttpParams()
      .set('client_id', this.CLIENT_ID)
      .set('grant_type', 'authorization_code')
      .set('code', code)
      .set('redirect_uri', this.REDIRECT_URI)
      .set('code_verifier', codeVerifier);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http
      .post<TokenResponse>(this.TOKEN_URL, body.toString(), { headers })
      .pipe(
        tap((response) => {
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('refresh_token', response.refresh_token);
        }),
        catchError((error) => {
          console.error('Error exchanging code for token:', error);
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
