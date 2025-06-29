import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/components/home.component';
import { GraphComponent } from './features/graph/graph.component';
import { Graph3dComponent } from './features/graph3d/graph3d.component';
import { CallbackComponent } from './features/spotify/callback/callback.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'graph', component: GraphComponent },
    { path: 'graph3d', component: Graph3dComponent },
    { path: 'callback', component: CallbackComponent },
    { path: 'dashboard', component: DashboardComponent }
];
