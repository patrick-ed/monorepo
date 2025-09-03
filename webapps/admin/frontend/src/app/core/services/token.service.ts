import { Injectable } from '@angular/core';

/**
 * Interface representing the decoded payload of a JWT.
 */
interface JwtPayload {
  sub: string; // Subject (usually the username or user ID)
  iat: number; // Issued At (timestamp)
  exp: number; // Expiration Time (timestamp)
  [key: string]: any; // Allow other custom claims
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private readonly TOKEN_KEY = "auth_token"

  constructor() { }

  /**
   * Retrieves the authentication token from localStorage.
   * @returns The token string or null if not found.
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Saves the authentication token to localStorage.
   * @param token The token string to save.
   */
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Removes the authentication token from localStorage.
   */
  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Decodes the payload from a JWT.
   * This method correctly handles Base64Url decoding.
   * @returns The decoded payload object or null if the token is invalid or missing.
   */
  private decodePayload(): JwtPayload | null {
    const token = this.getToken();
    if (!token) {
      console.error('No token found.');
      return null;
    }

    try {
      const payloadEncoded = token.split('.')[1];
      if (!payloadEncoded) {
        throw new Error('Invalid token format: Missing payload.');
      }

      // Decode Base64Url string
      const payloadDecoded = this.decodeBase64Url(payloadEncoded);
      return JSON.parse(payloadDecoded);
    } catch (e) {
      console.error('Failed to decode token payload:', e);
      return null;
    }
  }

  /**
   * Decodes a Base64Url encoded string.
   * @param str The string to decode.
   * @returns The decoded string.
   */
  private decodeBase64Url(str: string): string {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3:
        output += '=';
        break;
      default:
        throw new Error('Illegal base64url string!');
    }
    return decodeURIComponent(atob(output).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }

  /**
   * Gets the username (subject) from the token payload.
   * @returns The username string or null if not available.
   */
  getUsername(): string | null {
    const payload = this.decodePayload();
    return payload ? payload.sub : null;
  }

  /**
   * Gets the expiration date from the token payload.
   * @returns A Date object or null if not available.
   */
  getExpirationDate(): Date | null {
    const payload = this.decodePayload();
    if (!payload || !payload.exp) {
      return null;
    }
    // The 'exp' claim is in seconds, so multiply by 1000 for milliseconds
    const expirationDate = new Date(0);
    expirationDate.setUTCSeconds(payload.exp);
    return expirationDate;
  }

  /**
   * Checks if the token is expired.
   * @returns True if the token is expired or missing, false otherwise.
   */
  isTokenExpired(): boolean {
    const expirationDate = this.getExpirationDate();
    if (!expirationDate) {
      return true; // No expiration date means it's invalid/expired
    }
    return expirationDate.valueOf() < new Date().valueOf();
  }
}
