import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/spotify/auth.service';
import { GeneralUtilsService } from '../../../core/services/utils/general-utils.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private spotifyAuthService = inject(AuthService);
  private generalUtils = inject(GeneralUtilsService)

  ngOnInit(): void {

  }

  login() {
    this.generalUtils.removeItemsFromLocalStorage("savedTracks")
    this.spotifyAuthService.redirectToSpotifyLogin();
  }
}
