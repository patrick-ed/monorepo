import { AfterViewInit, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from '../../core/services/spotify/api.service';
import { Artist, Paging, TrackDetails, UserProfile } from '../../core/models/spotify.model';
import { UtilsService } from '../../core/services/spotify/utils.service';
import { TopItemsTimeRange, TopItemsType } from '../../core/services/spotify/inputs';
import { BehaviorSubject, of, tap } from 'rxjs';

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

  private _userProfile = new BehaviorSubject<UserProfile | null>(null);
  private _topTracks = new BehaviorSubject<Paging<TrackDetails> | null>(null);
  private _topArtists = new BehaviorSubject<Paging<Artist> | null>(null);
  private _savedTracks = new BehaviorSubject<Paging<TrackDetails> | null>(null);

  public userProfile = this._userProfile.asObservable();
  public topTracks = this._topTracks.asObservable();
  public topArtists = this._topArtists.asObservable();
  public savedTracks = this._savedTracks.asObservable();

  ngAfterViewInit(): void {
    this.redirectIfNotLoggedIn();
    this.fetchAllSavedTracks(0)
  }

  public fetchAllSavedTracks(offset: number = 0) {
    const maxTracks = 1000;


  }

  public proccessUserData() {
  }

  public extractArtistsFromSavedTracks(savedTracks: TrackDetails[]) {
    const artists = savedTracks.flatMap(trackDetails => trackDetails.track.artists);
    return this.spotifyUtils.getDistinctArtists(artists);
  }

  public fetchUserProfile() {
    this.spotifyApiService.getUserProfile().pipe(
      tap(profile => this._userProfile.next(profile))
    ).subscribe({
      error: (error) => console.error('Error fetching user profile:', error)
    });
  }

  public fetchUserTopTracks() {
    const loadTopItemsInput = {
      type: TopItemsType.TRACKS,
      timeRange: TopItemsTimeRange.LONG_TERM,
      limit: 50,
      offset: 0
    }

    this.spotifyApiService.getUserTopItems(loadTopItemsInput).pipe(
      tap(tracks => {
        console.log("Top tracks fetched", tracks)
        this._topTracks.next(tracks as Paging<TrackDetails>)
      })
    ).subscribe({
      error: (error) => console.error('Error fetching top tracks:', error)
    });
  }

  public fetchUserTopArtists() {
    const loadTopItemsInput = {
      type: TopItemsType.ARTISTS,
      timeRange: TopItemsTimeRange.LONG_TERM,
      limit: 20,
      offset: 0
    }

    this.spotifyApiService.getUserTopItems(loadTopItemsInput).pipe(
      tap(artists => this._topArtists.next(artists as Paging<Artist>))
    ).subscribe({
      error: (error) => console.error('Error fetching top artists:', error)
    });
  }

  public fetchUserSavedTracks(limit: number = 50, offset: number = 0): TrackDetails[] | void {
    this.spotifyApiService.getUserSavedTracks(limit, offset).pipe(
      tap(tracks => this._savedTracks.next(tracks))
    ).subscribe({
      next: (tracks) => {
        this._savedTracks.next(tracks);
        console.log("saved tracks fetched", this._savedTracks.value);
      },
      error: (error) => console.error('Error fetching saved tracks:', error)
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
