import { Component, inject, OnInit, signal } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentProviderCardComponent } from '../../components/appointment-provider-card/appointment-provider-card';
import { PaymentService } from '../../../payments/services/payment.service';
import { AppointmentStatus } from '../../enums';
import { computed } from '@angular/core';

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

  onCancel(id: number): void {
    if (!confirm('Annuler ce rendez-vous ?')) return;
    this.actingId.set(id);
    this.appointmentService.cancelAsProvider(id).subscribe({
      next: () => this.actingId.set(null),
      error: () => { this.actingId.set(null); this.errorMessage.set('Erreur lors de l\'annulation.'); },
    });
  }

  onRefund(appointmentId: number): void {
    if (!confirm('Rembourser le client pour ce rendez-vous ?')) return;
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
