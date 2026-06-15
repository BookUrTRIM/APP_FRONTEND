import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { ClientHeader } from '../../../layouts/client-layout/components/client-header/client-header';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, ClientHeader],
  templateUrl: './app-header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppHeader {
  private readonly auth = inject(AuthService);

  readonly isClient = this.auth.isClient;
}
