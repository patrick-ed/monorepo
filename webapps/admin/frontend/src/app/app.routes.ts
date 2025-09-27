import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
    { path: 'login', component: HomeComponent },
    { path: '', component: DashboardComponent, canActivate: [authGuard]},

    { path: '**', redirectTo: '' },
];
