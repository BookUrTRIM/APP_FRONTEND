import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { StripeConnectService } from '../../services/stripe-connect.service';
import { ProviderAccountService } from '../../services/provider-account.service';
import type { ProviderAccountModel } from '../../models';

@Component({
  selector: 'app-stripe-connect-page',
  standalone: true,
  templateUrl: './stripe-connect-page.html',
})
export class StripeConnectPage implements OnInit {
  private readonly providerAccountService = inject(ProviderAccountService);
  private readonly stripeConnect    = inject(StripeConnectService);
  private readonly router           = inject(Router);

  readonly provider    = signal<ProviderAccountModel | null>(null);
  readonly isLoading   = signal(true);
  readonly isActing    = signal(false);
  readonly errorMessage = signal('');

  get isConfigured(): boolean {
    return !!this.provider()?.stripe_account_id;
  }

  ngOnInit(): void {
    this.providerAccountService.load().subscribe({
      next: (data) => {
        this.provider.set(data);
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
