import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal';
import { ProviderSidebar } from '../../components/provider-sidebar/provider-sidebar';
import { ProviderTopbar } from '../../components/provider-topbar/provider-topbar';
import { ProviderBottomNav } from '../../components/provider-bottom-nav/provider-bottom-nav';
import type { ProviderAccountModel } from '../../../../features/provider/models';

@Component({
  selector: 'app-provider-layout',
  standalone: true,
  imports: [RouterOutlet, ConfirmModalComponent, ProviderSidebar, ProviderTopbar, ProviderBottomNav],
  templateUrl: './provider-layout.html',
})
export class ProviderLayout implements OnInit {
  private readonly http = inject(HttpClient);

  readonly provider = signal<ProviderAccountModel | null>(null);

  ngOnInit(): void {
    this.http.get<ProviderAccountModel>('/providers/me').subscribe({
      next: data => this.provider.set(data),
    });
  }
}
