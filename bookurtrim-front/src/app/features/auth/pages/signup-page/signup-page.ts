import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SignupFormComponent } from '../../components/signup-form/signup-form';

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [RouterLink, SignupFormComponent],
  templateUrl: './signup-page.html',
})
export class SignupPage {
  private readonly route = inject(ActivatedRoute);

  readonly returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
}
