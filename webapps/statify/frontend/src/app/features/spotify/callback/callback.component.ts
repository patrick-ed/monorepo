import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/spotify/auth.service';
import { ENV } from '../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  imports: [],
  template: '',
})
export class CallbackComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  TOKEN_URL = ENV.SPOTIFY.TOKEN_URL;
  CLIENT_ID = ENV.SPOTIFY.CLIENT_ID;
  REDIRECT_URI = ENV.SPOTIFY.REDIRECT_URI;

  ngOnInit(): void {
    this.getToken();
  }

  private getToken() {
    this.route.queryParamMap.subscribe(params => {
      const code = params.get('code');
      if (code) {
        this.authService.exchangeCodeForToken(code).subscribe({
          next: (response) => {
            this.handleSuccess(response);
          },
          error: (err) => {
            this.handleError(err);
          }
        });
      }
    });
  }

  private handleSuccess(response: any) {
    console.log('Successfully obtained token!', response);
    this.router.navigate(['/dashboard'], { queryParams: { success: 'auth_success' } });
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    this.router.navigate(['/'], { queryParams: { error: 'auth_failed' } });
  }
}
