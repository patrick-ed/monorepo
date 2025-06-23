import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { AboutComponent } from './pages/about/about.component';
import { LegacyComponent } from './pages/legacy/legacy.component';

export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'legacy', component: LegacyComponent },
    { path: 'about', component: AboutComponent }
];
