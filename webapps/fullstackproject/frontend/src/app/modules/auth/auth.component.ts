import { Component } from '@angular/core';

@Component({
  selector: 'app-auth',
  imports: [],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {

  authenticated = false

  ngOnInit() {
    localStorage.getItem('token') ? this.authenticated = true : this.authenticated = false
  }  
}
