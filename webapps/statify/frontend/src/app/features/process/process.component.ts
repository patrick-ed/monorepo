import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Subject, takeUntil, tap } from 'rxjs';
import { Idle, Loading, Result, Status, Success } from '../../core/models/result.model';
import { ArtistDetails, TrackDetails, UserData, UserProfile } from '../../core/models/spotify.model';
import { ApiService } from '../../core/services/spotify/api.service';
import { TrackProcessing } from './api/track-processing';
import { GeneralUtilsService } from '../../core/services/utils/general-utils.service';
import { LoadItemsInput, TopItemsTimeRange } from '../../core/services/spotify/inputs';
import { ProcessApi } from './api/process.api';

/**
 * Page that loads just after a successful Spotify authentication / login
 *
 * This page looks like a loading page for the user and gathers all the statistics from the user including the graph
 * data.
 */
@Component({
  selector: 'app-process',
  imports: [],
  templateUrl: './process.component.html',
  styleUrl: './process.component.scss'
})
export class ProcessComponent implements OnInit, OnDestroy {

  /**
   * 1. Fetch user profile
   * 2. Fetch top artists / tracks
   * 3. Fetch user saved tracks
   * 4. Aggregate saved tracks and generate genre graph data
   * 5. Save all to UserData then add to local storage
   */
  private router = inject(Router);
  private spotifyApiService = inject(ApiService);
  private processApi = inject(ProcessApi);
  private trackProcessor = inject(TrackProcessing);
  private generalUtils = inject(GeneralUtilsService);

  private MAX_SAVED_TRACKS = 1000

  private destroy$ = new Subject<void>();

  private _userProfile$ = new BehaviorSubject<Result<UserProfile>>(new Idle());
  public userProfile$ = this._userProfile$.asObservable();

  private _userSavedTracks$ = new BehaviorSubject<Result<TrackDetails[]>>(new Idle());
  public userSavedTracks$ = this._userSavedTracks$.asObservable();

  private _userTopTracks$ = new BehaviorSubject<Result<TrackDetails[]>>(new Idle());
  public userTopTracks$ = this._userTopTracks$.asObservable();

  private _userTopArtists$ = new BehaviorSubject<Result<ArtistDetails[]>>(new Idle());
  public userTopArtists$ = this._userTopArtists$.asObservable();

  // Currently loaded user saved tracks
  private _loadedUserSavedTracks: TrackDetails[] = this.loadTracksFromCache();
  private _totalUserSavedTracks: number = 0

  ngOnInit(): void {
    this.redirectIfNotLoggedIn()

    this.setupDataListeners()
    this.triggerDataHarvest()
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupDataListeners() {
    this.aggregateUserDataListener();
  }

  private triggerDataHarvest() {
    this.fetchUserProfile()
    this.fetchUserTopTracks()
    this.fetchUserTopArtists()
    this.fetchAllUserSavedTracks(this._loadedUserSavedTracks.length)
  }

  private aggregateUserDataListener() {
    combineLatest([
      this._userProfile$,
      this._userTopTracks$,
      this._userTopArtists$,
      this._userSavedTracks$
    ]).pipe(
      tap(([profile, topTracks, topArtists, savedTracks]) => {
        // If all 4 streams have reached SUCCESS, we process the final object
        if (
          profile.status === Status.SUCCESS &&
          topTracks.status === Status.SUCCESS &&
          topArtists.status === Status.SUCCESS &&
          savedTracks.status === Status.SUCCESS
        ) {
          this.processFinalAggregation(
            profile.data,
            topTracks.data,
            topArtists.data,
            savedTracks.data
          );
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  private processFinalAggregation(
    profile: UserProfile,
    topTracks: TrackDetails[],
    topArtists: ArtistDetails[],
    savedTracks: TrackDetails[]
  ) {
    console.log("All data fetched! Generating graph and aggregating...");

    // 1. Get all artist IDs for the graph from saved tracks
    const artistIds = this.trackProcessor.fetchArtistIdsByTrackDetails(savedTracks);

    this.trackProcessor.fetchArtistDetailsById(this.spotifyApiService, artistIds).subscribe(result => {
      if (result.status === Status.SUCCESS) {
        const genreGroups = this.trackProcessor.condenseGenres(result.data);
        const graphData = this.trackProcessor.prepareGenreData(genreGroups);

        const userData: UserData = {
          userProfile: profile,
          savedTracks: savedTracks,
          topTracks: topTracks,
          topArtists: topArtists,
          genreGraphData: graphData
        };

        this.generalUtils.saveItemsToLocalStorage('userData', [userData]);

        this.generalUtils.saveItemsToLocalStorage('savedTracks', savedTracks);
        this.generalUtils.saveItemsToLocalStorage('genreGraphData', [graphData]);

        console.log("Aggregation complete and saved to cache.");

        this.router.navigate(['/dashboard']);
      }
    });
  }

  private fetchUserProfile() {
    this.processApi.fetchUserProfile(this.spotifyApiService).subscribe(result => {
      this._userProfile$.next(result);
    });
  }

  private fetchUserTopTracks() {
    const loadTopItemsInput = {
      timeRange: TopItemsTimeRange.LONG_TERM,
      limit: 50,
      offset: 0
    };

    this.processApi.fetchUserTopTracks(this.spotifyApiService, loadTopItemsInput).subscribe(result => {
      if (result.status === Status.SUCCESS) {
        this._userTopTracks$.next(new Success(result.data.items));
      } else {
        this._userTopTracks$.next(result as any);
      }
    });
  }

  private fetchUserTopArtists() {
    const loadTopItemsInput = {
      timeRange: TopItemsTimeRange.LONG_TERM,
      limit: 50,
      offset: 0
    };

    this.processApi.fetchUserTopArtists(this.spotifyApiService, loadTopItemsInput).subscribe(result => {
      if (result.status === Status.SUCCESS) {

        const artistIds = new Set(result.data.items.map(a => a.id));
        this.trackProcessor.fetchArtistDetailsById(this.spotifyApiService, artistIds).subscribe(detailsResult => {
          this._userTopArtists$.next(detailsResult);
        });
      } else {
        this._userTopArtists$.next(result as any);
      }
    });
  }

  private redirectIfNotLoggedIn() {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      this.router.navigate(['/']);
    }
  }

  private loadTracksFromCache(): TrackDetails[] {
    const result = this.generalUtils.loadItemsFromLocalStorage<TrackDetails>("savedTracks");
    if (result.status === Status.SUCCESS) {
      return result.data;
    }
    return [];
  }

  private fetchAllUserSavedTracks(fetchedTracks: number) {
    const loadItemsInput: LoadItemsInput = {
      offset: fetchedTracks,
      limit: 50
    }

    if (this._totalUserSavedTracks > 0 && (fetchedTracks >= this._totalUserSavedTracks || fetchedTracks >= this.MAX_SAVED_TRACKS)) {
      this._userSavedTracks$.next(new Success(this._loadedUserSavedTracks));
      return;
    }

    this._userSavedTracks$.next(new Loading());

    this.processApi.fetchUserSavedTracks(this.spotifyApiService, loadItemsInput).subscribe(result => {
      if (result.status == Status.SUCCESS) {
        this._totalUserSavedTracks = result.data.total;
        this._loadedUserSavedTracks = [...this._loadedUserSavedTracks, ...result.data.items];

        const nextOffset = result.data.offset + result.data.limit;

        if (nextOffset < this._totalUserSavedTracks && nextOffset < this.MAX_SAVED_TRACKS) {
          this.fetchAllUserSavedTracks(nextOffset);
        } else {
          this._userSavedTracks$.next(new Success(this._loadedUserSavedTracks));
        }
      } else if (result.status == Status.ERROR) {
        this._userSavedTracks$.next(result as any);
      }
    });
  }
}
