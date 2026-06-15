import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DecimalPipe, NgClass } from '@angular/common';
import { ProviderDetailService } from '../../services/provider-detail.service';
import { formatDuration } from '../../../prestations/mapper';
import type { ServiceModel } from '../../../prestations/models';

@Component({
  selector: 'app-provider-book-page',
  standalone: true,
  imports: [DecimalPipe, NgClass],
  templateUrl: './provider-book-page.html',
})
export class ProviderBookPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly providerDetail = inject(ProviderDetailService);

  readonly services = this.providerDetail.services;
  readonly reviewsTotal = this.providerDetail.reviewsTotal;
  readonly averageRating = this.providerDetail.averageRating;

  readonly stars = [1, 2, 3, 4, 5];

  readonly formatDuration = formatDuration;

  private get providerId(): number {
    return Number(this.route.parent?.snapshot.paramMap.get('id'));
  }

  book(service: ServiceModel): void {
    this.router.navigate(
      ['/providers', this.providerId, 'book'],
      { queryParams: { serviceId: service.id } }
    );
  }
}
