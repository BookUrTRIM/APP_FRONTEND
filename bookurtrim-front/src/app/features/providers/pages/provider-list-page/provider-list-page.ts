import { Component, inject, OnInit, signal } from '@angular/core';
import { ProviderService } from '../../services/provider.service';
import { ProviderCardComponent } from '../../components/provider-card/provider-card';

@Component({
  selector: 'app-provider-list-page',
  standalone: true,
  imports: [ProviderCardComponent],
  templateUrl: './provider-list-page.html',
})
export class ProviderListPage implements OnInit {
  private readonly providerService = inject(ProviderService);

  readonly providers = this.providerService.providers;
  readonly isLoading = this.providerService.isLoading;
  readonly errorMessage = signal('');

  ngOnInit(): void {
    this.providerService.loadAll().subscribe({
      error: (err) => {
        const detail = err?.error?.detail ?? 'Erreur inconnue';
        this.errorMessage.set(`Impossible de charger les prestataires. (${err?.status ?? ''} ${detail})`);
      },
    });
  }
}
