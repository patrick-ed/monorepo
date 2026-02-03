import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthComponent, AuthCredentials } from '../auth/auth.component';
import { AuthService } from '../auth/auth.service';
import { OtpComponent, OtpCredentials } from "../otp/otp.component";
import { OtpService } from '../otp/otp.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { ApiService } from '../../core/services/api.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { SiteMonitoringService, SiteStatus } from "../../core/services/site-monitoring.service";
import { Observable } from "rxjs";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'app-home',
    imports: [CommonModule, AuthComponent, OtpComponent, CardComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    standalone: true,
})
export class HomeComponent implements OnInit {

  private authService = inject(AuthService)
  private otpService = inject(OtpService)
  private router = inject(Router)
  private siteMonitoringService = inject(SiteMonitoringService);

  loggedIn = false
  verifiedOtp = false
  username = ''

  siteStatuses$!: Observable<SiteStatus[]>;

  ngOnInit(): void {
    this.siteStatuses$ = this.siteMonitoringService.getSiteStatuses();
  }

  handleLogin(credentials: AuthCredentials) {
    console.log('Login attempt with:', credentials);

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Backend response:', response);
        this.loggedIn = true
        this.verifiedOtp = false
        this.username = credentials.username || ''
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.loggedIn = false
        this.verifiedOtp = false
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

        this.router.navigate(['/'])
      },
      error: (ex) => {
        console.error('OTP failed:', ex);
        this.verifiedOtp = false
      }
    });
  }
}
