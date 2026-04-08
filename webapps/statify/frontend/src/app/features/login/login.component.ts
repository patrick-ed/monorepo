import {Component, inject} from '@angular/core';
import {AuthService} from '../../core/services/spotify/auth.service';
import {GeneralUtilsService} from '../../core/services/utils/general-utils.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private spotifyAuthService = inject(AuthService);
  private generalUtils = inject(GeneralUtilsService)

  ngOnInit(): void {

  }

  login() {
    this.generalUtils.removeItemsFromLocalStorage("savedTracks")
    this.spotifyAuthService.redirectToSpotifyLogin();
  }
}
