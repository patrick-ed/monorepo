import { Component } from '@angular/core';
import {CardComponent} from '../../core/components/card/card.component';
import {CommonModule} from '@angular/common';

interface SocialLink {
  name: string,
  link: string,
}

@Component({
  selector: 'app-about',
  imports: [
    CardComponent,
    CommonModule
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  linkedin: SocialLink = {name: 'Linkedin', link: 'https://www.linkedin.com/in/patricked/'};
  github: SocialLink = {name: 'Github', link: 'https://github.com/patrick-ed/'};
  leetcode: SocialLink = {name: 'Leetcode', link: 'https://leetcode.com/u/patrick-ed/'};
  email: SocialLink = {name: 'Email', link: 'mailto:patrickedumdum@gmail.com'};

  socialLinks: SocialLink[] = [this.linkedin, this.github, this.leetcode, this.email];

}
