import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LogoutButtonComponent } from '../../../../shared/components/logout-button/logout-button';
import type { NavItem } from '../../../../shared/models';
import type { ProviderAccountModel } from '../../../../features/provider/models';

const STRIPE_CONNECT_PATH = '/pro/stripe-connect';

@Component({
  selector: 'app-provider-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LogoutButtonComponent],
  templateUrl: './provider-sidebar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProviderSidebar {
  readonly provider = input<ProviderAccountModel | null>(null);

  readonly showStripeBadge = computed(() => {
    const p = this.provider();
    return !!p && !p.stripe_account_id;
  });

  readonly stripeConnectPath = STRIPE_CONNECT_PATH;

  readonly navItems: NavItem[] = [
    {
      path: '/pro/dashboard',
      label: 'Dashboard',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    },
    {
      path: '/pro/planning',
      label: 'Planning & dispos',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    },
    {
      path: '/pro/appointments',
      label: 'Mes rendez-vous',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    },
    {
      path: '/pro/services',
      label: 'Catalogue de services',
      icon: 'M4 6h16M4 10h16M4 14h16M4 18h16',
    },
    {
      path: '/pro/profile',
      label: 'Mon profil',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    },
    {
      path: STRIPE_CONNECT_PATH,
      label: 'Paiements',
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
  ];
}
