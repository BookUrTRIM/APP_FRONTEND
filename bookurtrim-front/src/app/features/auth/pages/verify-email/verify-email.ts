import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

type VerifyStatus = 'check-inbox' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './verify-email.html'
})
export class VerifyEmailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  status = signal<VerifyStatus>('loading');
  errorMessage = signal<string>('');

  ngOnInit() {
    const state = this.route.snapshot.queryParamMap.get('state');
    if (state === 'check-inbox') {
      this.status.set('check-inbox');
      return;
    }
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.status.set('error');
      this.errorMessage.set('Aucun jeton de sécurité n\'a été fourni. Le lien est invalide.');
      return;
    }
    this.status.set('loading');
    this.authService.verifyEmail(token).subscribe({
      next: () => {
        this.status.set('success');
      },
      error: (err) => {
        this.status.set('error');
        this.errorMessage.set(err.error?.detail || 'Le lien est invalide ou a expiré.');
      }
    });
  }
}
