import { Routes } from '@angular/router';
import {Login} from './components/login/login';
import {Signup} from './components/signup/signup';


export const AUTH_ROUTES: Routes = [
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
