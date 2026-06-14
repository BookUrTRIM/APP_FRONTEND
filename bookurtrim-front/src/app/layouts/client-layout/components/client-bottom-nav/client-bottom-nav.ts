import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import type { NavItem } from '../../../../shared/models';

@Component({
  selector: 'app-client-bottom-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './client-bottom-nav.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientBottomNav {
  readonly navItems: NavItem[] = [
    {
      path: '/client/providers',
      label: 'Rechercher',
      icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    },
    {
      path: '/client/appointments',
      label: 'Rendez-vous',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    },
    {
      path: '/client/profile',
      label: 'Profil',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    },
  ];
}
