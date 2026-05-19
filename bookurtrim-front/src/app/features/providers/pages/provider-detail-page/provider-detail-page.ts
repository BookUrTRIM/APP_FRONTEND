import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { getProviderFullName, getProviderInitials, mapProviderDTOToModel } from '../../mapper';
import { mapServiceDTOToModel, formatDuration } from '../../../services/mapper';
import { DecimalPipe } from '@angular/common';
import type { ProviderModel } from '../../models';
import type { ServiceModel } from '../../../services/models';
import type { ServiceResponseDTO } from '../../../services/dtos';
import type { ProviderResponseDTO } from '../../dtos';

@Component({
  selector: 'app-provider-detail-page',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './provider-detail-page.html',
})
export class ProviderDetailPage implements OnInit {
  private readonly route  = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly http   = inject(HttpClient);

  readonly provider = signal<ProviderModel | null>(null);
  readonly services = signal<ServiceModel[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');

  readonly getFullName  = getProviderFullName;
  readonly getInitials  = getProviderInitials;
  readonly formatDuration = formatDuration;

  get providerId(): number { return Number(this.route.snapshot.paramMap.get('id')); }

  ngOnInit(): void {
    const id = this.providerId;
    forkJoin({
      provider: this.http.get<ProviderResponseDTO>(`/providers/${id}`),
      services: this.http.get<ServiceResponseDTO[]>(`/providers/${id}/services`),
    }).subscribe({
      next: ({ provider, services }) => {
        this.provider.set(mapProviderDTOToModel(provider));
        const list = Array.isArray(services)
          ? services
          : (services as { items?: ServiceResponseDTO[] })?.items ?? [];
        this.services.set(list.map(mapServiceDTOToModel));
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(`Erreur ${err?.status ?? ''} : impossible de charger ce prestataire.`);
        this.isLoading.set(false);
      },
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
