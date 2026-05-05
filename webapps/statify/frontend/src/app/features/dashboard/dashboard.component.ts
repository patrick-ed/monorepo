import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

import {TrackDetails, UserData, UserProfile} from '../../core/models/spotify.model';
import { Idle, Result, Status, Success } from '../../core/models/result.model';
import { UserProfileCardComponent } from './components/user-profile-card/user-profile-card.component';
import { GeneralUtilsService } from '../../core/services/utils/general-utils.service';
import { GenreGraphData } from '../../core/d3/interfaces';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [UserProfileCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  private router = inject(Router);
  private generalUtils = inject(GeneralUtilsService);

  private _userData: Result<UserData> = new Idle();
  private _genreGraphData: Result<GenreGraphData> = new Idle();

  private _userProfile$ = new BehaviorSubject<Result<UserProfile>>(new Idle());
  public userProfile: Observable<Result<UserProfile>> = this._userProfile$.asObservable();

  ngOnInit() {
    this.getUserSpotifyData();
  }

  private getUserSpotifyData() {
    const result = this.generalUtils.loadItemsFromLocalStorage<UserData>('userData');
    const savedTracks = this.generalUtils.loadItemsFromLocalStorage<TrackDetails>('savedTracks');
    console.log(savedTracks);

    if (result.status === Status.SUCCESS && result.data.length > 0) {
      const data = result.data[0];
      this._userData = new Success(data);
      this._genreGraphData = new Success(data.genreGraphData);
      this._userProfile$.next(new Success(data.userProfile));
    }
  }

  public onClickViewGenreGraph(): void {
    if (this._genreGraphData.status === Status.SUCCESS) {
      this.router.navigate(['/genreGraph']);
    } else {
      console.log('No genre graph data found in cache.');
    }
  }
}
