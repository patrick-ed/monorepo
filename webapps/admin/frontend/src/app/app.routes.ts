import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/components/home.component';
import { PingComponent } from './features/ping/components/ping.component';
import { PingPageComponent } from './features/ping/pages/ping-page.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'ping', component: PingPageComponent },

    { path: '**', redirectTo: '' },
];
