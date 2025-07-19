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


  saveItemsToLocalStorage<T>(key: string, items: T[]) {
    try {
      const jsonString = JSON.stringify(items);
      localStorage.setItem(key, jsonString);

      console.log(`Saved ${items.length} items of ${key} from local storage.`);
    } catch (error) {
      console.error(`Error saving ${key} to local storage:`, error);
    }
  }

  loadItemsFromLocalStorage<T>(key: string): T[] | null {

    const jsonString = localStorage.getItem(key);
    if (!jsonString) {
      console.log(`${key} not found in local storage.`);
      return null;
    }

    try {
      const items: T[] = JSON.parse(jsonString);
      console.log(`Loaded ${items.length} items of ${key} from local storage.`);
      return items;
    } catch (error) {
      console.error(`Error parsing ${key} from local storage:`, error);
      localStorage.removeItem(key);
      return null;
    }
  }

  removeItemsFromLocalStorage(key: string) {
    localStorage.removeItem(key);
  }
}
