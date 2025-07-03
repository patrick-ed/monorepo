import { AfterViewInit, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/spotify/auth.service';
import { ApiService } from '../../core/services/spotify/api.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements AfterViewInit {

  constructor(private router: Router) { }
  private spotifyApiService = inject(ApiService);

  ngAfterViewInit(): void {
    this.redirectIfNotLoggedIn();
  }

  public onClickFetchUserProfile() {
    this.spotifyApiService.getUserProfile().subscribe({
      next: (userProfile) => {
        console.log('User Profile:', userProfile);
      },
      error: (error) => {
        console.error('Error fetching user profile:', error);
      }
    });
  }

  private redirectIfNotLoggedIn() {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      console.log('User is not logged in. Redirecting to login page...');
      this.router.navigate(['/']);
    }
  }
}
