import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from '../../core/services/spotify/api.service';
import { ArtistDetails, Paging, TrackDetails, UserProfile } from '../../core/models/spotify.model';
import { UtilsService } from '../../core/services/spotify/utils.service';
import { LoadItemsInput, TopItemsTimeRange } from '../../core/services/spotify/inputs';
import { BehaviorSubject, Subject, takeUntil, tap } from 'rxjs';
import { Error, Idle, Loading, Result, Status, Success } from '../../core/models/result.model';
import { DashboardApi } from './api/dashboard.api';
import { UserProfileCardComponent } from './components/user-profile-card/user-profile-card.component';
import { GeneralUtilsService } from '../../core/services/utils/general-utils.service';
import { TrackProcessing } from './api/track-processing';


@Component({
  selector: 'app-dashboard',
  imports: [UserProfileCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  constructor(
    private router: Router,
    private spotifyUtils: UtilsService,
    private trackProcessing: TrackProcessing
  ) {
    this.userTopTracksListener()
    this.artistDetailsListener()
    this.genreGroupListener()
  }
  private destroy$ = new Subject<void>();

  private MAX_SAVED_TRACKS = 1000

  private spotifyApiService = inject(ApiService);
  private dashboardApi = inject(DashboardApi);
  private generalUtils = inject(GeneralUtilsService);

  private _userProfile$ = new BehaviorSubject<Result<UserProfile>>(new Idle());
  public userProfile$ = this._userProfile$.asObservable();

  private _userTopTracks$ = new BehaviorSubject<Result<Paging<TrackDetails>>>(new Idle());
  public userTopTracks$ = this._userTopTracks$.asObservable();

  private _loadingUserSavedTracks: TrackDetails[] = this.generalUtils.loadItemsFromLocalStorage("savedTracks") || []
  private _totalSavedTracks: number = 0

  private _userSavedTracks$ = new BehaviorSubject<Result<TrackDetails[]>>(new Idle());
  public userSavedTracks$ = this._userSavedTracks$.asObservable();


  private _artistDetails$ = new BehaviorSubject<Result<ArtistDetails[]>>(new Idle());
  public artistDetails$ = this._artistDetails$.asObservable();

  private _genreGroups$ = new BehaviorSubject<Result<string[][]>>(new Idle());


  ngOnInit(): void {
    this.redirectIfNotLoggedIn();

    this.onClickFetchUserProfile();
    this.onClickFetchUserTopTracks();
  }

  public extractArtistsFromSavedTracks(savedTracks: TrackDetails[]) {
    const artists = savedTracks.flatMap(trackDetails => trackDetails.track.artists);
    return this.spotifyUtils.getDistinctArtists(artists);
  }

  public onClickFetchUserSavedTracks(): void {
    this.fetchAllUserSavedTracks()
  }

  private userTopTracksListener() {
    this._userSavedTracks$.pipe(
      tap(result => {
        if (result.status == Status.SUCCESS) {
          const artistids = this.trackProcessing.fetchAllArtistIds(result.data)
          this.processArtistDetails(artistids)
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  private artistDetailsListener() {
    this._artistDetails$.pipe(
      tap(result => {
        if (result.status == Status.SUCCESS) {
          const genreGroups = this.trackProcessing.condenseGenres(result.data)
          this._genreGroups$.next(new Success(genreGroups))
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  private genreGroupListener() {
    this._genreGroups$.pipe(
      tap(result => {
        if (result.status == Status.SUCCESS) {
          const genreGraphData = this.trackProcessing.prepareGenreData(result.data)
          console.log("Genre Links:", genreGraphData.links)
          console.log("Genre Nodes:", genreGraphData.nodes)
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  private fetchAllUserSavedTracks(loadedTracks: number = this._loadingUserSavedTracks.length) {
    const loadItmesInput: LoadItemsInput = {
      offset: loadedTracks,
      limit: 50
    }

    if (loadedTracks <= this._totalSavedTracks && loadedTracks <= this.MAX_SAVED_TRACKS - 50) {
      this._userSavedTracks$.next(new Loading)
      this.dashboardApi.fetchUserSavedTracks(this.spotifyApiService, loadItmesInput).subscribe(result => {
        if (result.status == Status.SUCCESS) {
          const offset = result.data.offset
          const tracks = result.data.items
          this._totalSavedTracks = result.data.total

          this.appendToUserSavedTracks(tracks)
          this.fetchAllUserSavedTracks(offset + 50) // Recursive API call?? What could go wrong?
        }
        else {
          this._userSavedTracks$.next(new Error("Failed fetching saved tracks"))
        }
      })
    }
    else {
      const finalSavedTracks = this._loadingUserSavedTracks
      this.generalUtils.saveItemsToLocalStorage("savedTracks", finalSavedTracks)
      this._userSavedTracks$.next(new Success(finalSavedTracks))
    }
  }

  private processArtistDetails(artistIds: Set<string>) {
    this.trackProcessing.fetchAllArtistDetails(this.spotifyApiService, artistIds).subscribe(result => {
      this._artistDetails$.next(result);
    });
  }

  private appendToUserSavedTracks(savedTracksBatch: TrackDetails[]): void {
    const currentTracks = this._loadingUserSavedTracks
    const updatedTracks = [...currentTracks, ...savedTracksBatch];
    console.log("Updated tracks:", updatedTracks)

    this._loadingUserSavedTracks = updatedTracks
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