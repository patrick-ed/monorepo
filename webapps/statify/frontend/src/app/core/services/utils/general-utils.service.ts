import { Injectable, input } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeneralUtilsService {

  /**
   * Generates a random string of the specified length.
   * 
   * @param length The length of the random string to generate.
   * @returns A random string.
   */
  generateRandomString(length: number): string {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  }

  /**
   * Computes the SHA-256 hash of the given input string.
   *
   * @param input The input string to hash.
   * @returns A promise that resolves to the hexadecimal representation of the hash.
   */
  async sha256(input: string): Promise<ArrayBuffer> {
    const data = new TextEncoder().encode(input);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return digest;
  }

  /**
   * Encodes a string to Base64 URL format.
   *
   * @param digest The ArrayBuffer to encode.
   * @returns The Base64 URL encoded string.
   */
  base64UrlEncode(digest: ArrayBuffer): string {
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
}
