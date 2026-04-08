import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { GenreGraphComponent } from './features/genre-graph/genre-graph.component';
import { GraphComponent } from './features/graph/graph.component';
import { Graph3dComponent } from './features/graph3d/graph3d.component';
import { CallbackComponent } from './features/spotify/callback/callback.component';
import {LoginComponent} from './features/login/login.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'graph', component: GraphComponent },
    { path: 'graph3d', component: Graph3dComponent },
    { path: 'callback', component: CallbackComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'genreGraph', component: GenreGraphComponent },
    { path: 'genregraph', component: GenreGraphComponent }
];
