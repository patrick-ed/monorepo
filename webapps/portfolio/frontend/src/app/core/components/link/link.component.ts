import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-link',
  imports: [RouterLink],
  templateUrl: './link.component.html',
  styleUrl: './link.component.scss'
})
export class LinkComponent {

  @Input() href: string = '';
}
