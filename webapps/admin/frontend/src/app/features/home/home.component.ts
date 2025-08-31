import { Component, inject } from '@angular/core';
import { AuthComponent, AuthCredentials } from '../auth/auth.component';
import { AuthService } from '../auth/auth.service';
import { OtpComponent, OtpCredentials } from "../otp/otp.component";
import { OtpService } from '../otp/otp.service';

@Component({
    selector: 'app-home',
    imports: [AuthComponent, OtpComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    standalone: true,
})
export class HomeComponent {

  private authService = inject(AuthService)
  private otpService = inject(OtpService)
  loggedIn = false
  verifyOTP = true

  handleLogin(credentials: AuthCredentials) {
    console.log('Login attempt with:', credentials);
    
    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Backend response:', response); 
        alert(response);
      },
      error: (error) => {
        console.error('Login failed:', error);
        alert(`Login failed: ${error.error}`); 
      }
    });
  }

    handleOtp(otp: OtpCredentials) {
      console.log('Login attempt with:', otp);

      this.otpService.sendOtp(otp).subscribe({
        next: (response) => {
          console.log('Backend response:', response); 
          alert(response);
        },
        error: (error) => {
          console.error('Login failed:', error);
          alert(`Login failed: ${error.error}`); 
        }
    });
  }
}
