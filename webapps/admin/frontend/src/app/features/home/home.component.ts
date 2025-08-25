import { Component } from '@angular/core';
import { AuthComponent, AuthCredentials } from '../auth/auth.component';

@Component({
    selector: 'app-home',
    imports: [AuthComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    standalone: true,
})
export class HomeComponent {

    handleLogin(credentials: AuthCredentials) {
    console.log('Login attempt with:', credentials);
    
    // TODO: Call authentication service here.
    alert(`Logging in with: ${credentials.username}`);
  }

}
