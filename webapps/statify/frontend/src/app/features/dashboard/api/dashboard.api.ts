import { catchError, map, Observable, of, startWith, tap } from "rxjs";
import { Error, Loading, Result, Success } from "../../../core/models/result.model";
import { Paging, TrackDetails, UserProfile } from "../../../core/models/spotify.model";
import { ApiService } from "../../../core/services/spotify/api.service";
import { Injectable } from "@angular/core";
import { LoadItemsInput, LoadTopItemsInput } from "../../../core/services/spotify/inputs";

@Injectable({
    providedIn: 'root'
})
export class DashboardApi {
    public fetchUserProfile(spotifyApiService: ApiService): Observable<Result<UserProfile>> {
        return spotifyApiService.getUserProfile().pipe(
            map(profile => new Success<UserProfile>(profile)),
            catchError(error => of(new Error(error))),
            startWith(new Loading())
        );
    }

    public fetchUserTopTracks(
        spotifyApiService: ApiService,
        loadTopItemsInput: LoadTopItemsInput
    ): Observable<Result<Paging<TrackDetails>>> {

        return spotifyApiService.getUserTopTracks(loadTopItemsInput).pipe(
            map(topTracks => new Success<Paging<TrackDetails>>(topTracks)),
            catchError(error => of(new Error(error))),
            startWith(new Loading())
        );
    }

    public fetchUserSavedTracks(
        spotifyApiService: ApiService,
        loadItmesInput: LoadItemsInput
    ): Observable<Result<Paging<TrackDetails>>> {

        return spotifyApiService.getUserSavedTracks(loadItmesInput).pipe(
            map(savedTracks => new Success<Paging<TrackDetails>>(savedTracks)),
            catchError(error => of(new Error(error))),
            startWith(new Loading())
        );
    }
}