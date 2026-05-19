import { Component, inject, OnInit, signal } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentCardComponent } from '../../components/appointment-card/appointment-card';

@Component({
  selector: 'app-appointment-list-page',
  standalone: true,
  imports: [AppointmentCardComponent],
  templateUrl: './appointment-list-page.html',
})
export class AppointmentListPage implements OnInit {
  private readonly appointmentService = inject(AppointmentService);

  readonly isLoading   = this.appointmentService.isLoading;
  readonly upcoming    = this.appointmentService.upcoming;
  readonly past        = this.appointmentService.past;
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

  onCancel(id: number): void {
    if (!confirm('Confirmer l\'annulation de ce rendez-vous ?')) return;
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
