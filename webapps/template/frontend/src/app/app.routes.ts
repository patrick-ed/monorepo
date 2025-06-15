import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PingComponent } from './components/ping/ping.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'ping', component: PingComponent },

    { path: '**', redirectTo: '' },
];
