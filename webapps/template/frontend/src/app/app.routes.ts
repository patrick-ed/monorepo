import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/components/home.component';
import { PingComponent } from './features/ping/components/ping.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'ping', component: PingComponent },

    { path: '**', redirectTo: '' },
];
