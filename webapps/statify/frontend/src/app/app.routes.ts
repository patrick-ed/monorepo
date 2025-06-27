import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/components/home.component';
import { GraphComponent } from './features/graph/graph.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'graph', component: GraphComponent },
];
