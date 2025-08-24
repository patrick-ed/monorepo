import { Component } from '@angular/core';
import { PingComponent } from "../components/ping.component";

@Component({
  selector: 'app-ping-page',
  imports: [PingComponent],
  templateUrl: './ping-page.component.html',
  styleUrl: './ping-page.component.scss'
})
export class PingPageComponent {

}
