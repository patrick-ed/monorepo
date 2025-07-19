import { Component, Input } from '@angular/core';
import { Success } from '../../../../core/models/result.model';
import { UserProfile } from '../../../../core/models/spotify.model';

@Component({
  selector: 'app-user-profile-card',
  imports: [],
  templateUrl: './user-profile-card.component.html',
  styleUrl: './user-profile-card.component.scss'
})
export class UserProfileCardComponent {
  @Input({ required: true }) profileResult!: Success<UserProfile>;
}
