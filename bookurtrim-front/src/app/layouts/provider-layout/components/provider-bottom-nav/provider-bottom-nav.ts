import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import type { NavItem } from '../../../../shared/models';

@Component({
  selector: 'app-provider-bottom-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './provider-bottom-nav.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProviderBottomNav {
  readonly navItems: NavItem[] = [
    {
      path: '/pro/appointments',
      label: 'RDV',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    },
    {
      path: '/pro/planning',
      label: 'Planning',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    },
    {
      path: '/pro/services',
      label: 'Services',
      icon: 'M4 6h16M4 10h16M4 14h16M4 18h16',
    },
    {
      path: '/pro/profile',
      label: 'Profil',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    },
    {
      path: '/pro/stripe-connect',
      label: 'Paiements',
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
  ];
}
