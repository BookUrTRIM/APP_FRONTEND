import { Routes } from '@angular/router';
import { PlanningPage } from './pages/planning-page/planning-page';

export const PROVIDER_ROUTES: Routes = [
  { path: 'planning', component: PlanningPage },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
