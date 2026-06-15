import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DecimalPipe, NgClass } from '@angular/common';
import { ProviderDetailService } from '../../services/provider-detail.service';

@Component({
  selector: 'app-provider-reviews-page',
  standalone: true,
  imports: [DecimalPipe, NgClass],
  templateUrl: './provider-reviews-page.html',
})
export class ProviderReviewsPage {
  private readonly route = inject(ActivatedRoute);
  private readonly providerDetail = inject(ProviderDetailService);

  readonly reviews = this.providerDetail.reviews;
  readonly reviewsTotal = this.providerDetail.reviewsTotal;
  readonly averageRating = this.providerDetail.averageRating;
  readonly hasMore = this.providerDetail.hasMore;
  readonly isLoadingMore = this.providerDetail.isLoadingMore;

  readonly stars = [1, 2, 3, 4, 5];

  private get providerId(): number {
    return Number(this.route.parent?.snapshot.paramMap.get('id'));
  }

  loadMoreReviews(): void {
    this.providerDetail.loadMoreReviews(this.providerId);
  }
}
