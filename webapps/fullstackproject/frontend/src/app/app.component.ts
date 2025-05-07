import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,],
  template: '<router-outlet />'
})
export class AppComponent {
  title = 'fullstackproject';
}
