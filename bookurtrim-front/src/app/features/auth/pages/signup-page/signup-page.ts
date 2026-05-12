import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SignupFormComponent } from '../../components/signup-form/signup-form';

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [RouterLink, SignupFormComponent],
  templateUrl: './signup-page.html',
})
export class SignupPage {}
