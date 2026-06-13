import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { getProviderFullName, getProviderInitials, mapProviderDTOToModel } from '../../mapper';
import { mapServiceDTOToModel, formatDuration } from '../../../prestations/mapper';
import { DecimalPipe, NgClass } from '@angular/common';
import type { ProviderModel } from '../../models';
import type { ServiceModel } from '../../../prestations/models';
import type { ServiceResponseDTO } from '../../../prestations/dtos';
import type { ProviderResponseDTO } from '../../dtos';
import type { ReviewResponseDTO } from '../../../appointments/dtos/review.dto';
import type { ReviewModel } from '../../../appointments/models/review.model';

@Component({
  selector: 'app-provider-detail-page',
  standalone: true,
  imports: [DecimalPipe, NgClass],
  templateUrl: './provider-detail-page.html',
})
export class ProviderDetailPage implements OnInit {
  private readonly route  = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly http   = inject(HttpClient);

  readonly provider     = signal<ProviderModel | null>(null);
  readonly services     = signal<ServiceModel[]>([]);
  readonly reviews        = signal<ReviewModel[]>([]);
  readonly reviewsTotal   = signal(0);
  readonly reviewsPage    = signal(1);
  readonly isLoadingMore  = signal(false);
  readonly isLoading      = signal(true);
  readonly errorMessage   = signal('');

  readonly hasMore = computed(() => this.reviews().length < this.reviewsTotal());

  readonly averageRating = computed(() => {
    const r = this.reviews();
    if (r.length === 0) return 0;
    return r.reduce((sum, rv) => sum + rv.rating, 0) / r.length;
  });

  readonly stars = [1, 2, 3, 4, 5];

  readonly getFullName  = getProviderFullName;
  readonly getInitials  = getProviderInitials;
  readonly formatDuration = formatDuration;

  get providerId(): number { return Number(this.route.snapshot.paramMap.get('id')); }

  ngOnInit(): void {
    const id = this.providerId;
    forkJoin({
      provider: this.http.get<ProviderResponseDTO>(`/providers/${id}`),
      services: this.http.get<ServiceResponseDTO[]>(`/providers/${id}/services`),
      reviews:  this.http.get<{ items: ReviewResponseDTO[]; total: number }>(`/providers/${id}/reviews`).pipe(
        catchError(() => of({ items: [], total: 0 }))
      ),
    }).subscribe({
      next: ({ provider, services, reviews }) => {
        this.provider.set(mapProviderDTOToModel(provider));
        const list = Array.isArray(services)
          ? services
          : (services as { items?: ServiceResponseDTO[] })?.items ?? [];
        this.services.set(list.map(mapServiceDTOToModel));
        this.reviews.set(reviews.items.map(r => ({
          id: r.id, appointmentId: r.appointment_id,
          rating: r.rating, comment: r.comment, reviewedAt: r.reviewed_at,
        })));
        this.reviewsTotal.set(reviews.total);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(`Erreur ${err?.status ?? ''} : impossible de charger ce prestataire.`);
        this.isLoading.set(false);
      },
    });
  }

  loadMoreReviews(): void {
    const nextPage = this.reviewsPage() + 1;
    this.isLoadingMore.set(true);
    this.http.get<{ items: ReviewResponseDTO[]; total: number }>(
      `/providers/${this.providerId}/reviews?page=${nextPage}&limit=20`
    ).subscribe({
      next: (res) => {
        this.reviews.update(list => [...list, ...res.items.map(r => ({
          id: r.id, appointmentId: r.appointment_id,
          rating: r.rating, comment: r.comment, reviewedAt: r.reviewed_at,
        }))]);
        this.reviewsPage.set(nextPage);
        this.isLoadingMore.set(false);
      },
      error: () => this.isLoadingMore.set(false),
    });
  }

  book(service: ServiceModel): void {
    this.router.navigate(
      ['/client/providers', this.providerId, 'book'],
      { queryParams: { serviceId: service.id } }
    );
  }

  goBack(): void { this.router.navigate(['/client/providers']); }
}
