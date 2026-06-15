import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProviderService } from './provider.service';
import { mapServiceDTOToModel } from '../../prestations/mapper';
import type { ProviderModel } from '../models';
import type { ServiceModel } from '../../prestations/models';
import type { ServiceResponseDTO } from '../../prestations/dtos';
import type { ReviewResponseDTO } from '../../appointments/dtos/review.dto';
import type { ReviewModel } from '../../appointments/models/review.model';

function mapReviewDTOToModel(dto: ReviewResponseDTO): ReviewModel {
  return {
    id: dto.id,
    appointmentId: dto.appointment_id,
    rating: dto.rating,
    comment: dto.comment,
    reviewedAt: dto.reviewed_at,
  };
}

@Injectable()
export class ProviderDetailService {
  private readonly http = inject(HttpClient);
  private readonly providerService = inject(ProviderService);

  readonly provider = signal<ProviderModel | null>(null);
  readonly services = signal<ServiceModel[]>([]);
  readonly reviews = signal<ReviewModel[]>([]);
  readonly reviewsTotal = signal(0);
  readonly reviewsPage = signal(1);
  readonly isLoading = signal(true);
  readonly isLoadingMore = signal(false);
  readonly errorMessage = signal('');

  readonly hasMore = computed(() => this.reviews().length < this.reviewsTotal());

  readonly averageRating = computed(() => {
    const r = this.reviews();
    if (r.length === 0) return 0;
    return r.reduce((sum, rv) => sum + rv.rating, 0) / r.length;
  });

  load(providerId: number): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    forkJoin({
      provider: this.providerService.getById(providerId),
      services: this.http.get<ServiceResponseDTO[]>(`/providers/${providerId}/services`),
      reviews: this.http.get<{ items: ReviewResponseDTO[]; total: number }>(`/providers/${providerId}/reviews`).pipe(
        catchError(() => of({ items: [], total: 0 }))
      ),
    }).subscribe({
      next: ({ provider, services, reviews }) => {
        this.provider.set(provider);
        const list = Array.isArray(services)
          ? services
          : (services as { items?: ServiceResponseDTO[] })?.items ?? [];
        this.services.set(list.map(mapServiceDTOToModel));
        this.reviews.set(reviews.items.map(mapReviewDTOToModel));
        this.reviewsTotal.set(reviews.total);
        this.reviewsPage.set(1);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(`Erreur ${err?.status ?? ''} : impossible de charger ce prestataire.`);
        this.isLoading.set(false);
      },
    });
  }

  loadMoreReviews(providerId: number): void {
    const nextPage = this.reviewsPage() + 1;
    this.isLoadingMore.set(true);
    this.http.get<{ items: ReviewResponseDTO[]; total: number }>(
      `/providers/${providerId}/reviews?page=${nextPage}&limit=20`
    ).subscribe({
      next: (res) => {
        this.reviews.update(list => [...list, ...res.items.map(mapReviewDTOToModel)]);
        this.reviewsPage.set(nextPage);
        this.isLoadingMore.set(false);
      },
      error: () => this.isLoadingMore.set(false),
    });
  }
}
