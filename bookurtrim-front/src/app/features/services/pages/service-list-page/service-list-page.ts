import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from '../../services/service.service';
import { ServiceCardComponent } from '../../components/service-card/service-card';
import type { ServiceModel } from '../../models';

@Component({
  selector: 'app-service-list-page',
  standalone: true,
  imports: [ServiceCardComponent],
  templateUrl: './service-list-page.html',
})
export class ServiceListPage implements OnInit {
  private readonly serviceService = inject(ServiceService);
  private readonly router = inject(Router);

  readonly services = this.serviceService.services;
  readonly isLoading = this.serviceService.isLoading;
  readonly errorMessage = signal('');

  ngOnInit(): void {
    this.serviceService.loadMyServices().subscribe({
      error: (err) => {
        const detail = err?.error?.detail ?? err?.message ?? 'Erreur inconnue';
        this.errorMessage.set(`Erreur ${err?.status ?? ''} : ${detail}`);
      },
    });
  }

  onEdit(service: ServiceModel): void {
    this.router.navigate(['/pro/services', service.id]);
  }

  onDelete(id: number): void {
    if (!confirm('Supprimer cette prestation ?')) return;
    this.serviceService.delete(id).subscribe({
      error: () => this.errorMessage.set('Erreur lors de la suppression.'),
    });
  }

  goToCreate(): void {
    this.router.navigate(['/pro/services/new']);
  }
}
