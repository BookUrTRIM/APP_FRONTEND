import { Component, input, output } from '@angular/core';
import { AppointmentStatus } from '../../enums';
import { formatAppointmentDate, formatAppointmentTime } from '../../mapper';
import type { AppointmentModel } from '../../models';

@Component({
  selector: 'app-appointment-provider-card',
  standalone: true,
  imports: [],
  templateUrl: './appointment-provider-card.html',
})
export class AppointmentProviderCardComponent {
  readonly appointment = input.required<AppointmentModel>();
  readonly isActing    = input(false);
  readonly onComplete  = output<number>();
  readonly onCancel    = output<number>();

  readonly AppointmentStatus = AppointmentStatus;
  readonly formatDate = formatAppointmentDate;
  readonly formatTime = formatAppointmentTime;

  readonly statusLabel: Record<AppointmentStatus, string> = {
    [AppointmentStatus.PENDING]:   'En attente de paiement',
    [AppointmentStatus.CONFIRMED]: 'Confirmé',
    [AppointmentStatus.COMPLETED]: 'Terminé',
    [AppointmentStatus.CANCELLED]: 'Annulé',
  };

  readonly statusClass: Record<AppointmentStatus, string> = {
    [AppointmentStatus.PENDING]:   'bg-yellow-100 text-yellow-800',
    [AppointmentStatus.CONFIRMED]: 'bg-blue-100 text-blue-800',
    [AppointmentStatus.COMPLETED]: 'bg-green-100 text-green-800',
    [AppointmentStatus.CANCELLED]: 'bg-red-100 text-red-700',
  };
}
