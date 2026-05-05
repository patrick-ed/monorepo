import {Component, inject} from '@angular/core';
import {ApiService} from '../../core/services/spotify/api.service';
import {catchError, map, Observable, of, startWith} from 'rxjs';
import {Error, Loading, Result, Status, Success} from '../../core/models/result.model';
import {TrackAnalysis, UserProfile} from '../../core/models/spotify.model';
import {DevApi} from './dev.api';


// Screen for testing APIs
@Component({
  selector: 'app-dev',
  imports: [],
  templateUrl: './dev.component.html',
  styleUrl: './dev.component.scss'
})
export class DevComponent {

  private spotifyApiService = inject(ApiService)
  private devApiService = inject(DevApi)

  public fetchTrackAnalysis(){

    const trackId = "1Q7EgiMOuwDcB0PJC6AzON" // Best Part - H.E.R

    this.devApiService.getTrackAnalysis(trackId, this.spotifyApiService).subscribe(result =>{
      if (result.status === Status.SUCCESS){
        console.log(result.data);
      }
      else {
        console.log("error");
      }
    })
  }
}
