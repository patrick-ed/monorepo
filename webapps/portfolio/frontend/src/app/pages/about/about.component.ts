import { Component } from '@angular/core';
import {CardComponent} from '../../core/components/card/card.component';

@Component({
  selector: 'app-about',
  imports: [
    CardComponent
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {

}
