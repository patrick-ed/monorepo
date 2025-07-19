import { AfterViewInit, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from '../../core/services/spotify/api.service';
import { Artist, Paging, TrackDetails, UserProfile } from '../../core/models/spotify.model';
import { UtilsService } from '../../core/services/spotify/utils.service';
import { TopItemsTimeRange } from '../../core/services/spotify/inputs';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { Idle, Loading, Result, Success } from '../../core/models/response.model';
import { DashboardApi } from './api/dashboard.api';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements AfterViewInit {

  constructor(
    private router: Router,
    private spotifyUtils: UtilsService,
  ) { }

  private spotifyApiService = inject(ApiService);
  private dashboardApi = inject(DashboardApi);

  private _userProfile$ = new BehaviorSubject<Result<UserProfile>>(new Idle());
  public userProfile$ = this._userProfile$.asObservable();

  private _userTopTracks$ = new BehaviorSubject<Result<Paging<TrackDetails>>>(new Idle());
  public userTopTracks$ = this._userTopTracks$.asObservable();

  ngAfterViewInit(): void {
    this.redirectIfNotLoggedIn();

    this.onClickFetchUserProfile();
    this.onClickFetchUserTopTracks();
  }

  public extractArtistsFromSavedTracks(savedTracks: TrackDetails[]) {
    const artists = savedTracks.flatMap(trackDetails => trackDetails.track.artists);
    return this.spotifyUtils.getDistinctArtists(artists);
  }

  public onClickFetchUserProfile(): void {
    this.dashboardApi.fetchUserProfile(this.spotifyApiService).subscribe(result => {
      this._userProfile$.next(result);
      console.log('User profile fetched:', result);
    });
  }

  public onClickFetchUserTopTracks(): void {
    const loadTopItemsInput = {
      timeRange: TopItemsTimeRange.LONG_TERM,
      limit: 50,
      offset: 0
    };

    this.dashboardApi.fetchUserTopTracks(this.spotifyApiService, loadTopItemsInput).subscribe(result => {
      this._userTopTracks$.next(result);
      console.log('User top tracks fetched:', result);
    });
  }

  public redirectIfNotLoggedIn() {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      console.log('User is not logged in. Redirecting to login page...');
      this.router.navigate(['/']);
    }
  }
}