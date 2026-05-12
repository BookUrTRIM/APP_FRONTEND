import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoginFormComponent } from '../../components/login-form/login-form';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [RouterLink, LoginFormComponent],
  templateUrl: './login-page.html',
})
export class LoginPage {}
