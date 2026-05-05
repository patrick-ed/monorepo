import {Injectable} from '@angular/core';
import {ApiService} from '../../core/services/spotify/api.service';
import {catchError, map, Observable, of, startWith} from 'rxjs';
import {Error, Loading, Result, Success} from '../../core/models/result.model';
import {TrackAnalysis, UserProfile} from '../../core/models/spotify.model';

@Injectable({
  providedIn: 'root'
})
export class DevApi {


  public getTrackAnalysis(trackId:string, spotifyApiService: ApiService):Observable<Result<TrackAnalysis>> {
    return spotifyApiService.getTrackAnalysis(trackId).pipe(
      map(result => new Success(result)),
      catchError(error => of(new Error(error))),
      startWith(new Loading())
    )
  }
}
