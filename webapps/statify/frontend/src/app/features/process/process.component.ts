import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, map, Subject, takeUntil, tap } from 'rxjs';
import { Idle, Result, Status, Success } from '../../core/models/result.model';
import { ArtistDetails, TrackDetails, UserData, UserProfile } from '../../core/models/spotify.model';
import { ApiService } from '../../core/services/spotify/api.service';
import { TrackProcessing } from './api/track-processing';
import { GeneralUtilsService } from '../../core/services/utils/general-utils.service';
import { LoadItemsInput, TopItemsTimeRange } from '../../core/services/spotify/inputs';
import { ProcessApi } from './api/process.api';
import { CommonModule } from '@angular/common';

export interface LoadingStep {
  id: string;
  name: string;
  status: Status;
  percentage: number;
}

/**
 * Page that loads just after a successful Spotify authentication / login
 *
 * This page looks like a loading page for the user and gathers all the statistics from the user including the graph
 * data.
 */
@Component({
  selector: 'app-process',
  imports: [CommonModule],
  templateUrl: './process.component.html',
  styleUrl: './process.component.scss'
})
export class ProcessComponent implements OnInit, OnDestroy {

  private router = inject(Router);
  private spotifyApiService = inject(ApiService);
  private processApi = inject(ProcessApi);
  private trackProcessor = inject(TrackProcessing);
  private generalUtils = inject(GeneralUtilsService);

  private MAX_SAVED_TRACKS = 500;
  private destroy$ = new Subject<void>();

  // Data Streams
  private _userProfile$ = new BehaviorSubject<Result<UserProfile>>(new Idle());
  private _userSavedTracks$ = new BehaviorSubject<Result<TrackDetails[]>>(new Idle());
  private _userTopTracks$ = new BehaviorSubject<Result<TrackDetails[]>>(new Idle());
  private _userTopArtists$ = new BehaviorSubject<Result<ArtistDetails[]>>(new Idle());

  private _steps$ = new BehaviorSubject<LoadingStep[]>([
    { id: 'profile', name: 'User Profile', status: Status.IDLE, percentage: 0 },
    { id: 'top_tracks', name: 'Top Tracks', status: Status.IDLE, percentage: 0 },
    { id: 'top_artists', name: 'Top Artists', status: Status.IDLE, percentage: 0 },
    { id: 'saved_tracks', name: 'Library Sync', status: Status.IDLE, percentage: 0 },
    { id: 'graph', name: 'Generate Genre Graph', status: Status.IDLE, percentage: 0 }
  ]);

  // Expose steps and an overall percentage to the UI
  public steps$ = this._steps$.asObservable();
  public overallProgress$ = this._steps$.pipe(
    map(steps => {
      const total = steps.reduce((acc, step) => acc + step.percentage, 0);
      return Math.round(total / steps.length);
    })
  );

  private _loadedUserSavedTracks: TrackDetails[] = this.loadTracksFromCache();
  private _totalUserSavedTracks: number = 0;

  ngOnInit(): void {
    this.redirectIfNotLoggedIn();
    this.setupDataListeners();
    this.triggerDataHarvest();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupDataListeners() {
    this.aggregateUserDataListener();
  }

  private triggerDataHarvest() {
    this.fetchUserProfile();
    this.fetchUserTopTracks();
    this.fetchUserTopArtists();
    this.fetchAllUserSavedTracks(this._loadedUserSavedTracks.length);
  }

  private updateProgress(stepId: string, status: Status, percentage: number) {
    const currentSteps = this._steps$.value;
    const updatedSteps = currentSteps.map(step =>
      step.id === stepId ? { ...step, status, percentage } : step
    );
    this._steps$.next(updatedSteps);
  }

  private aggregateUserDataListener() {
    combineLatest([
      this._userProfile$,
      this._userTopTracks$,
      this._userTopArtists$,
      this._userSavedTracks$
    ]).pipe(
      tap(([profile, topTracks, topArtists, savedTracks]) => {
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
    this.updateProgress('graph', Status.LOADING, 50);

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

        this.updateProgress('graph', Status.SUCCESS, 100);

        // brief delay so the user sees 100% before redirecting
        // setTimeout(() => this.router.navigate(['/dashboard']), 800);
      }
    });
  }

  private fetchUserProfile() {
    this.updateProgress('profile', Status.LOADING, 50);
    this.processApi.fetchUserProfile(this.spotifyApiService).subscribe(result => {
      this._userProfile$.next(result);
      if (result.status === Status.SUCCESS) this.updateProgress('profile', Status.SUCCESS, 100);
    });
  }

  private fetchUserTopTracks() {
    this.updateProgress('top_tracks', Status.LOADING, 50);
    const loadTopItemsInput = {
      timeRange: TopItemsTimeRange.LONG_TERM,
      limit: 50,
      offset: 0
    };

    this.processApi.fetchUserTopTracks(this.spotifyApiService, loadTopItemsInput).subscribe(result => {
      if (result.status === Status.SUCCESS) {
        this._userTopTracks$.next(new Success(result.data.items));
        this.updateProgress('top_tracks', Status.SUCCESS, 100);
      } else {
        this._userTopTracks$.next(result as any);
      }
    });
  }

  private fetchUserTopArtists() {
    this.updateProgress('top_artists', Status.LOADING, 30);
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
          if (detailsResult.status === Status.SUCCESS) this.updateProgress('top_artists', Status.SUCCESS, 100);
        });
      } else {
        this._userTopArtists$.next(result as any);
      }
    });
  }

  private fetchAllUserSavedTracks(fetchedTracks: number) {
    const loadItemsInput: LoadItemsInput = { offset: fetchedTracks, limit: 50 };

    if (this._totalUserSavedTracks > 0 && (fetchedTracks >= this._totalUserSavedTracks || fetchedTracks >= this.MAX_SAVED_TRACKS)) {
      this._userSavedTracks$.next(new Success(this._loadedUserSavedTracks));
      this.updateProgress('saved_tracks', Status.SUCCESS, 100);
      return;
    }

    this.processApi.fetchUserSavedTracks(this.spotifyApiService, loadItemsInput).subscribe(result => {
      if (result.status == Status.SUCCESS) {
        this._totalUserSavedTracks = result.data.total;
        this._loadedUserSavedTracks = [...this._loadedUserSavedTracks, ...result.data.items];

        // Calculate dynamic percentage based on total tracks to be fetched
        const limit = Math.min(this._totalUserSavedTracks, this.MAX_SAVED_TRACKS);
        const currentPercentage = Math.min(Math.round((this._loadedUserSavedTracks.length / limit) * 100), 99);
        this.updateProgress('saved_tracks', Status.LOADING, currentPercentage);

        const nextOffset = result.data.offset + result.data.limit;
        if (nextOffset < this._totalUserSavedTracks && nextOffset < this.MAX_SAVED_TRACKS) {
          this.fetchAllUserSavedTracks(nextOffset);
        } else {
          this._userSavedTracks$.next(new Success(this._loadedUserSavedTracks));
          this.updateProgress('saved_tracks', Status.SUCCESS, 100);
        }
      } else if (result.status == Status.ERROR) {
        this._userSavedTracks$.next(result as any);
        this.updateProgress('saved_tracks', Status.ERROR, 0);
      }
    });
  }

  private redirectIfNotLoggedIn() {
    if (!localStorage.getItem('access_token')) this.router.navigate(['/']);
  }

  private loadTracksFromCache(): TrackDetails[] {
    const result = this.generalUtils.loadItemsFromLocalStorage<TrackDetails>("savedTracks");
    return result.status === Status.SUCCESS ? result.data : [];
  }
}
