import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { AuthComponent } from './modules/auth/auth.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    // Other routes
    { path: 'login', component: AuthComponent },
    { path: '**', redirectTo: '' },
];
