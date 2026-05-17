import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import type { ProviderModel } from './models';

@Component({
  selector: 'app-provider-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './provider-layout.html',
})
export class ProviderLayout implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly http = inject(HttpClient);

  readonly provider = signal<ProviderModel | null>(null);

  get initials(): string {
    const p = this.provider();
    if (!p) return '?';
    return `${p.first_name[0]}${p.last_name[0]}`.toUpperCase();
  }

  get fullName(): string {
    const p = this.provider();
    if (!p) return '';
    return `${p.first_name} ${p.last_name}`;
  }

  ngOnInit(): void {
    this.http.get<ProviderModel>('/providers/me').subscribe({
      next: data => this.provider.set(data),
    });
  }

  logout(): void { this.authService.logout(); }
}
