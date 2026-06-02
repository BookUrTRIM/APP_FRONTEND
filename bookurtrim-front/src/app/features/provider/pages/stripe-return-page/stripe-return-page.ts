import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-stripe-return-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './stripe-return-page.html',
})
export class StripeReturnPage {
  private readonly route = inject(ActivatedRoute);
  readonly mode: 'return' | 'refresh' = this.route.snapshot.data['mode'] ?? 'return';
}
