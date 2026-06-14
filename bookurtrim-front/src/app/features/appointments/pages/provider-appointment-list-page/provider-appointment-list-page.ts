import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentProviderCardComponent } from '../../components/appointment-provider-card/appointment-provider-card';
import { PaymentService } from '../../../payments/services/payment.service';
import { ConfirmModalService } from '../../../../shared/components/confirm-modal/confirm-modal.service';
import { AppointmentStatus } from '../../enums';

type Tab = 'upcoming' | 'history';

@Component({
  selector: 'app-provider-appointment-list-page',
  standalone: true,
  imports: [AppointmentProviderCardComponent],
  templateUrl: './provider-appointment-list-page.html',
})
export class ProviderAppointmentListPage implements OnInit {
  private readonly appointmentService = inject(AppointmentService);
  private readonly paymentService     = inject(PaymentService);
  private readonly confirmModal       = inject(ConfirmModalService);

  readonly isLoading = this.appointmentService.providerIsLoading;

  readonly upcoming = computed(() =>
    this.appointmentService.providerAppointments().filter(a =>
      a.status === AppointmentStatus.CONFIRMED
    )
  );

  readonly history = computed(() =>
    this.appointmentService.providerAppointments().filter(a =>
      a.status === AppointmentStatus.COMPLETED ||
      a.status === AppointmentStatus.CANCELLED  ||
      a.status === AppointmentStatus.EXPIRED
    )
  );

  readonly errorMessage = signal('');
  readonly actingId     = signal<number | null>(null);
  readonly activeTab    = signal<Tab>('upcoming');

  ngOnInit(): void {
    this.appointmentService.loadProviderAppointments().subscribe({
      error: (err) => this.errorMessage.set(
        `Impossible de charger les rendez-vous. (${err?.status ?? ''} ${err?.error?.detail ?? ''})`
      ),
    });
  }

  onComplete(id: number): void {
    this.actingId.set(id);
    this.appointmentService.complete(id).subscribe({
      next: () => { this.actingId.set(null); this.activeTab.set('history'); },
      error: () => { this.actingId.set(null); this.errorMessage.set('Erreur lors de la finalisation.'); },
    });
  }

  async onCancel(id: number): Promise<void> {
    const confirmed = await this.confirmModal.confirm({
      title: 'Annuler le rendez-vous',
      message: 'Le client sera remboursé automatiquement si un acompte a été versé.',
      confirmText: 'Annuler le rendez-vous',
      cancelText: 'Retour',
      variant: 'warning',
    });
    if (!confirmed) return;
    this.actingId.set(id);
    this.appointmentService.cancelAsProvider(id).subscribe({
      next: () => this.actingId.set(null),
      error: () => { this.actingId.set(null); this.errorMessage.set('Erreur lors de l\'annulation.'); },
    });
  }

  async onRefund(appointmentId: number): Promise<void> {
    const confirmed = await this.confirmModal.confirm({
      title: 'Rembourser le client',
      message: 'Le montant de l\'acompte sera remboursé intégralement sur la carte du client.',
      confirmText: 'Confirmer le remboursement',
      cancelText: 'Annuler',
      variant: 'warning',
    });
    if (!confirmed) return;
    this.actingId.set(appointmentId);
    this.paymentService.refundByAppointment(appointmentId).subscribe({
      next: () => {
        this.actingId.set(null);
        this.appointmentService.patchProviderStatus(appointmentId, AppointmentStatus.CANCELLED);
      },
      error: () => { this.actingId.set(null); this.errorMessage.set('Erreur lors du remboursement.'); },
    });
  }
}
