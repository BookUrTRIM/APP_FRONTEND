import { Component, input, output } from '@angular/core';
import { AppointmentStatus } from '../../enums';
import { formatAppointmentDate, formatAppointmentTime } from '../../mapper';
import type { AppointmentModel } from '../../models';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-appointment-provider-card',
  standalone: true,
  imports: [StatusBadgeComponent],
  templateUrl: './appointment-provider-card.html',
})
export class AppointmentProviderCardComponent {
  readonly appointment = input.required<AppointmentModel>();
  readonly isActing    = input(false);
  readonly onComplete  = output<number>();
  readonly onCancel    = output<number>();
  readonly onRefund    = output<number>();

  readonly AppointmentStatus = AppointmentStatus;
  readonly formatDate = formatAppointmentDate;
  readonly formatTime = formatAppointmentTime;

  readonly statusLabel: Record<AppointmentStatus, string> = {
    [AppointmentStatus.PENDING]:   'En attente de paiement',
    [AppointmentStatus.CONFIRMED]: 'Confirmé',
    [AppointmentStatus.COMPLETED]: 'Terminé',
    [AppointmentStatus.CANCELLED]: 'Annulé',
    [AppointmentStatus.EXPIRED]:   'Expiré',
  };

  readonly statusClass: Record<AppointmentStatus, string> = {
    [AppointmentStatus.PENDING]:   'bg-gold/10 text-chocolate border border-gold/20',
    [AppointmentStatus.CONFIRMED]: 'bg-rose/15 text-rose',
    [AppointmentStatus.COMPLETED]: 'bg-rose/15 text-rose',
    [AppointmentStatus.CANCELLED]: 'bg-bordeaux/15 text-bordeaux',
    [AppointmentStatus.EXPIRED]:   'bg-bordeaux/10 text-bordeaux',
  };
}
