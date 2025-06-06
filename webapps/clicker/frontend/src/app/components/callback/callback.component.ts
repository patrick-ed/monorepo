import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [],
  template: '<p class="loading-text">Loading...</p>',
  styles: `.loading-text { text-align: center; margin-top: 5rem; font-size: 1.5rem; }`
})
export class CallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.authService.saveToken(token);
        this.router.navigate(['/dashboard']);
      } else {
        // Handle error case
        this.router.navigate(['/login']);
      }
    });
  }
}