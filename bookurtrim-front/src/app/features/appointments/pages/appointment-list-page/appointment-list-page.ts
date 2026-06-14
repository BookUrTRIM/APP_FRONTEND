import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentCardComponent } from '../../components/appointment-card/appointment-card';
import { ConfirmModalService } from '../../../../shared/components/confirm-modal/confirm-modal.service';
import type { AppointmentModel } from '../../models';

@Component({
  selector: 'app-appointment-list-page',
  standalone: true,
  imports: [AppointmentCardComponent, RouterLink],
  templateUrl: './appointment-list-page.html',
})
export class AppointmentListPage implements OnInit {
  private readonly appointmentService = inject(AppointmentService);
  private readonly router             = inject(Router);
  private readonly confirmModal       = inject(ConfirmModalService);

  readonly isLoading       = this.appointmentService.isLoading;
  readonly awaitingPayment = this.appointmentService.awaitingPayment;
  readonly upcoming        = this.appointmentService.upcoming;
  readonly past            = this.appointmentService.past;
  readonly errorMessage  = signal('');
  readonly cancellingId  = signal<number | null>(null);

  activeTab: 'upcoming' | 'past' = 'upcoming';

  ngOnInit(): void {
    this.appointmentService.loadMyAppointments().subscribe({
      error: (err) => {
        const detail = err?.error?.detail ?? 'Erreur inconnue';
        this.errorMessage.set(`Impossible de charger les rendez-vous. (${err?.status ?? ''} ${detail})`);
      },
    });
  }

  onPay(appointment: AppointmentModel): void {
    const amount = appointment.depositAmount ?? appointment.serviceBasePrice ?? 0;
    this.router.navigate(['/client/payments', appointment.id], {
      queryParams: amount ? { amount } : {},
    });
  }

  onPayBalance(appointment: AppointmentModel): void {
    const balance = (appointment.serviceBasePrice ?? 0) - (appointment.depositAmount ?? 0);
    if (balance <= 0) return;
    this.router.navigate(['/client/payments', appointment.id], { queryParams: { amount: balance } });
  }

  async onCancel(id: number): Promise<void> {
    const confirmed = await this.confirmModal.confirm({
      title: 'Annuler le rendez-vous',
      message: 'Cette action est irréversible. L\'annulation ne donnera pas lieu à un remboursement.',
      confirmText: 'Oui, annuler',
      cancelText: 'Retour',
      variant: 'danger',
    });
    if (!confirmed) return;
    this.cancellingId.set(id);
    this.appointmentService.cancel(id).subscribe({
      next: () => this.cancellingId.set(null),
      error: () => {
        this.cancellingId.set(null);
        this.errorMessage.set('Erreur lors de l\'annulation. Veuillez réessayer.');
      },
    });
  }
}
