import { Component, computed, inject } from '@angular/core';
import { ProviderDetailService } from '../../services/provider-detail.service';

@Component({
  selector: 'app-provider-about-page',
  standalone: true,
  templateUrl: './provider-about-page.html',
})
export class ProviderAboutPage {
  private readonly providerDetail = inject(ProviderDetailService);

  readonly provider = this.providerDetail.provider;

  readonly mapUrl = computed(() => {
    const address = this.provider()?.address;
    if (!address) return null;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  });
}
