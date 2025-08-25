import { Component } from '@angular/core';
import { CardComponent } from "../../shared/components/card/card.component";

@Component({
  selector: 'app-dashboard',
  imports: [CardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
