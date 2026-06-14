import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal';
import { AuthService } from '../../features/auth/services/auth.service';

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ConfirmModalComponent],
  templateUrl: './client-layout.html',
})
export class ClientLayout {
  private readonly authService = inject(AuthService);
  logout(): void { this.authService.logout(); }
}
