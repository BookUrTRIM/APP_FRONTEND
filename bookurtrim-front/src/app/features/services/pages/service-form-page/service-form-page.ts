import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from '../../services/service.service';
import { ServiceFormComponent } from '../../components/service-form/service-form';
import type { ServiceModel } from '../../models';
import type { ServiceCreateDTO, ServiceUpdateDTO } from '../../dtos';

@Component({
  selector: 'app-service-form-page',
  standalone: true,
  imports: [ServiceFormComponent],
  templateUrl: './service-form-page.html',
})
export class ServiceFormPage implements OnInit {
  private readonly serviceService = inject(ServiceService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly service = signal<ServiceModel | null>(null);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  get serviceId(): number | null {
    const id = this.route.snapshot.paramMap.get('id');
    return id ? Number(id) : null;
  }

  get isEdit(): boolean {
    return !!this.serviceId;
  }

  ngOnInit(): void {
    if (this.serviceId) {
      this.isLoading.set(true);
      this.serviceService.getById(this.serviceId).subscribe({
        next: s => { this.service.set(s); this.isLoading.set(false); },
        error: () => { this.errorMessage.set('Prestation introuvable.'); this.isLoading.set(false); },
      });
    }
  }

  onSubmit(dto: ServiceCreateDTO | ServiceUpdateDTO): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    const request$ = this.isEdit
      ? this.serviceService.update(this.serviceId!, dto as ServiceUpdateDTO)
      : this.serviceService.create(dto as ServiceCreateDTO);

    request$.subscribe({
      next: () => this.router.navigate(['/pro/services']),
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Une erreur est survenue. Veuillez réessayer.');
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/pro/services']);
  }
}
