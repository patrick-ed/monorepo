import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ApiService, User, Clicks } from '../../services/api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  user$!: Observable<User>;
  clicks$!: Observable<Clicks>;

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.user$ = this.apiService.getCurrentUser();
    this.clicks$ = this.apiService.getClicks();
  }

  increment(): void {
    this.clicks$ = this.apiService.incrementClicks();
  }

  reset(): void {
    this.clicks$ = this.apiService.resetClicks();
  }

  logout(): void {
    this.authService.logout();
  }
}