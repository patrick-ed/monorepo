import { Component, inject } from '@angular/core';
import { AuthComponent, AuthCredentials } from '../auth/auth.component';
import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'app-home',
    imports: [AuthComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    standalone: true,
})
export class HomeComponent {

  private authService = inject(AuthService)

  handleLogin(credentials: AuthCredentials) {
    console.log('Login attempt with:', credentials);
    
    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Backend response:', response); 
        alert(response);
      },
      error: (error) => {
        console.error('Login failed:', error);
        alert(`Login failed: ${error.error}`); 
      }
    });
  }
}
