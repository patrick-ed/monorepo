import { isPlatformBrowser, NgIf } from '@angular/common';
import { Component, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Theme } from './core/enums/theme.enum';
import {ButtonComponent} from './core/components/button/button.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, ButtonComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  theme: Theme = Theme.Dark;
  Theme = Theme;
  THEME_KEY = "theme"

  constructor(
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const storedTheme = localStorage.getItem(this.THEME_KEY);
      if (storedTheme) {
        this.theme = storedTheme as Theme;
      }
      this.updateThemeAttribute();
    }
  }

  toggleTheme() {
    this.theme = this.theme === Theme.Dark ? Theme.Light : Theme.Dark;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.THEME_KEY, this.theme);
    }
    this.updateThemeAttribute();
  }

  private updateThemeAttribute() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.theme === Theme.Dark) {
        this.renderer.setAttribute(document.documentElement, 'data-theme', 'dark');
      } else {
        this.renderer.removeAttribute(document.documentElement, 'data-theme');
      }
    }
  }
}
