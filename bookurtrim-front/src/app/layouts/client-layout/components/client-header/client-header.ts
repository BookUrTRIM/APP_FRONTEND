import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LogoutButtonComponent } from '../../../../shared/components/logout-button/logout-button';
import type { NavItem } from '../../../../shared/models';

@Component({
  selector: 'app-client-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LogoutButtonComponent],
  templateUrl: './client-header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientHeader {
  readonly navItems: NavItem[] = [
    { path: '/providers', label: 'Prestataires' },
    { path: '/client/appointments', label: 'Mes rendez-vous' },
    { path: '/client/profile', label: 'Mon profil' },
  ];
}
