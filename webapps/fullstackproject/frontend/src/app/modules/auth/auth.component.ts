import { Component } from '@angular/core';
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-auth',
  imports: [],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {

  authenticated = false
  loginUri = environment.apiUrl + '/login'

  ngOnInit() {
    localStorage.getItem('token') ? this.authenticated = true : this.authenticated = false
  }
}
