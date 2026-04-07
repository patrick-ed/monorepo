import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardComponent } from '../../core/components/card/card.component';

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
  private readonly birthDate = new Date('2006-04-25'); // Replace with your actual birth date if different

  get age(): number {
    const today = new Date();
    let age = today.getFullYear() - this.birthDate.getFullYear();
    const m = today.getMonth() - this.birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < this.birthDate.getDate())) {
      age--;
    }
    return age;
  }

  linkedin: SocialLink = {name: 'Linkedin', link: 'https://www.linkedin.com/in/patricked/'};
  github: SocialLink = {name: 'Github', link: 'https://github.com/patrick-ed/'};
  leetcode: SocialLink = {name: 'Leetcode', link: 'https://leetcode.com/u/patrick-ed/'};
  email: SocialLink = {name: 'Email', link: 'mailto:patrickedumdum@gmail.com'};

  socialLinks: SocialLink[] = [this.linkedin, this.github, this.leetcode, this.email];

}
