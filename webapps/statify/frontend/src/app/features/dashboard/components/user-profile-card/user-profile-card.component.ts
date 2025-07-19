import { Component, Input } from '@angular/core';
import { Result, Success } from '../../../../core/models/result.model';
import { UserProfile } from '../../../../core/models/spotify.model';
import { LoadingComponent } from '../../../../core/components/loading/loading.component';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-user-profile-card',
  imports: [AsyncPipe, LoadingComponent],
  templateUrl: './user-profile-card.component.html',
  styleUrl: './user-profile-card.component.scss'
})
export class UserProfileCardComponent {
  @Input({ required: true }) userProfile!: Observable<Result<UserProfile>>;
}
