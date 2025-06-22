import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { AboutComponent } from './pages/about/about.component';

export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'about', component: AboutComponent }
];
