import { AfterViewInit, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/spotify/auth.service';
import { ApiService } from '../../core/services/spotify/api.service';
import { Track } from '../../core/models/spotify.model';
import { UtilsService } from '../../core/services/spotify/utils.service';
import { TopItemsTimeRange, TopItemsType } from '../../core/services/spotify/inputs';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements AfterViewInit {

  constructor(
    private router: Router,
    private spotifyUtils: UtilsService
  ) { }

  private spotifyApiService = inject(ApiService);
  private likedTracks: Track[] = [];

  ngAfterViewInit(): void {
    this.redirectIfNotLoggedIn();
  }

  public onClickFetchUserProfile() {
    this.fetchUserProfile();
  }

  public onClickFetchUserSavedTracks() {
    this.fetchUserSavedTracks();
  }

  public onClickFetchUserTopTracks() {
    this.fetchUserTopTracks();
  }

  public onClickFetchUserTopArtists() {
    this.fetchUserTopArtists();
  }

  private fetchUserProfile() {
    this.spotifyApiService.getUserProfile().subscribe({
      next: (userProfile) => {
        console.log('User Profile:', userProfile);
      },
      error: (error) => {
        console.error('Error fetching user profile:', error);
      }
    });
  }

  private fetchUserTopTracks() {
    const loadTopItemsInput = {
      type: TopItemsType.TRACKS,
      timeRange: TopItemsTimeRange.LONG_TERM,
      limit: 20,
      offset: 0
    }

    this.spotifyApiService.getUserTopItems(loadTopItemsInput).subscribe({
      next: (tracks) => {
        console.log('Top Tracks:', tracks);
      },
      error: (error) => {
        console.error('Error fetching user top tracks:', error);
      }
    });
  }

  private fetchUserTopArtists() {
    const loadTopItemsInput = {
      type: TopItemsType.ARTISTS,
      timeRange: TopItemsTimeRange.LONG_TERM,
      limit: 20,
      offset: 0
    }

    this.spotifyApiService.getUserTopItems(loadTopItemsInput).subscribe({
      next: (tracks) => {
        console.log('Top Artists:', tracks);
      },
      error: (error) => {
        console.error('Error fetching user top artists:', error);
      }
    });
  }

  private fetchUserSavedTracks() {
    const limit = 50
    this.spotifyApiService.getUserSavedTracks(limit).subscribe({
      next: (tracks) => {
        this.likedTracks = tracks.items;
        console.log('Liked Tracks:', this.likedTracks);
      },
      error: (error) => {
        console.error('Error fetching user liked tracks:', error);
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
