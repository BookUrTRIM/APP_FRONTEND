import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { StripeConnectService } from '../../services/stripe-connect.service';
import type { ProviderModel } from '../../../provider-search/models';

@Component({
  selector: 'app-stripe-connect-page',
  standalone: true,
  templateUrl: './stripe-connect-page.html',
})
export class StripeConnectPage implements OnInit {
  private readonly http             = inject(HttpClient);
  private readonly stripeConnect    = inject(StripeConnectService);
  private readonly router           = inject(Router);

  readonly provider    = signal<ProviderModel | null>(null);
  readonly isLoading   = signal(true);
  readonly isActing    = signal(false);
  readonly errorMessage = signal('');

  get isConfigured(): boolean {
    return !!this.provider()?.stripeAccountId;
  }

  ngOnInit(): void {
    this.http.get<any>('/providers/me').subscribe({
      next: (data) => {
        this.provider.set({
          id:              data.id,
          userAccountId:   data.user_account_id,
          firstName:       data.first_name,
          lastName:        data.last_name,
          phone:           data.phone,
          businessName:    data.business_name ?? null,
          address:         data.address ?? null,
          stripeAccountId: data.stripe_account_id ?? null,
          createdAt:       data.created_at,
          updatedAt:       data.updated_at,
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Impossible de charger votre profil.');
        this.isLoading.set(false);
      },
    });
  }

  setup(): void {
    this.isActing.set(true);
    this.errorMessage.set('');

    const doOnboarding = () => {
      this.stripeConnect.getOnboardingLink().subscribe({
        next: ({ url }) => { window.location.href = url; },
        error: () => {
          this.isActing.set(false);
          this.errorMessage.set('Impossible de récupérer le lien Stripe.');
        },
      });
    };

    if (this.isConfigured) {
      doOnboarding();
    } else {
      this.stripeConnect.createAccount().subscribe({
        next: () => doOnboarding(),
        error: (err) => {
          if (err?.status === 409) {
            doOnboarding();
          } else {
            this.isActing.set(false);
            this.errorMessage.set('Impossible de créer le compte Stripe.');
          }
        },
      });
    }
  }
}
