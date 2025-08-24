import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/components/home.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },

    { path: '**', redirectTo: '' },
];
