import { Routes } from '@angular/router';
import {Landing} from './features/landing/components/landing/landing';

export const routes: Routes = [
  {
    path: '',
    component: Landing,
    pathMatch: 'full'
  },
];
