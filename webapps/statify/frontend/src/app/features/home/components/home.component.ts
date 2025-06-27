import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/spotify/auth.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private spotifyAuthService = inject(AuthService);

  login() {
    this.spotifyAuthService.redirectToSpotifyLogin();
  }
}
