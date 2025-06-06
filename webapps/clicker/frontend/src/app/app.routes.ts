import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CallbackComponent } from './components/callback/callback.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'login/success', component: CallbackComponent },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard] // Protect this route
    },
    // Redirect root path to dashboard if logged in, otherwise to login
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
    // Fallback route
    { path: '**', redirectTo: '/dashboard' }
];