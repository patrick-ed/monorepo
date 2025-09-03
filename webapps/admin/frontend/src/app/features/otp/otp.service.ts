import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OtpCredentials } from './otp.component';

@Injectable({
  providedIn: 'root'
})
export class OtpService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/auth';
  constructor() { }

  verifyOtp(otpCredentials: OtpCredentials): Observable<string> {
    const otpRequest = {
      username: otpCredentials.username,
      otp: otpCredentials.otp
    };
    return this.http.post(`${this.apiUrl}/verify-otp`, otpRequest, { responseType: 'text' });
  }
}
