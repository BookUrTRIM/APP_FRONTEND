import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StripeConnectService {
  private readonly http = inject(HttpClient);

  createAccount(): Observable<{ stripe_account_id: string }> {
    return this.http.post<{ stripe_account_id: string }>('/providers/me/stripe-connect', {});
  }

  getOnboardingLink(): Observable<{ url: string }> {
    return this.http.get<{ url: string }>('/providers/me/stripe-connect/onboarding');
  }
}
