import { Component, inject } from '@angular/core';
import { CardComponent } from '../../shared/components/card/card.component';
import { AuthComponent, AuthCredentials } from '../auth/auth.component';
import { AuthService } from '../auth/auth.service';
import { OtpComponent, OtpCredentials } from "../otp/otp.component";
import { OtpService } from '../otp/otp.service';

@Component({
    selector: 'app-home',
    imports: [AuthComponent, OtpComponent, CardComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    standalone: true,
})
export class HomeComponent {

  private authService = inject(AuthService)
  private otpService = inject(OtpService)
  private readonly TOKEN_KEY = 'auth_token';

  loggedIn = false
  verifiedOtp = false
  username = ''
  

  handleLogin(credentials: AuthCredentials) {
    console.log('Login attempt with:', credentials);
    
    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Backend response:', response); 
        this.loggedIn = true
        this.verifiedOtp = false
        this.username = credentials.username || ''
        alert(response);  
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.loggedIn = false
        this.verifiedOtp = false
        alert(`Login failed: ${error.error}`); 
      }
    });
  }

  handleOtp(otpCredentials: OtpCredentials) {
    console.log('OTP attempt with:', otpCredentials);
    otpCredentials.username = this.username

    this.otpService.verifyOtp(otpCredentials).subscribe({
      next: (response) => {
        console.log('Backend response:', response);
        this.verifiedOtp = true

        const token = JSON.parse(response).token;
        this.authService.finaliseLogin(token)
        this.username = this.authService.getUsername()

        alert(response);
      },
      error: (ex) => {
        console.error('OTP failed:', ex);
        this.verifiedOtp = false
        alert(`OTP failed: ${ex.error}`); 
      }
    });
  }
}
