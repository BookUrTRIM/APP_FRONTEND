import { Component, input, output } from '@angular/core';
import { AppointmentStatus } from '../../enums';
import { formatAppointmentDate, formatAppointmentTime, isCancellable } from '../../mapper';
import type { AppointmentModel } from '../../models';

@Component({
  selector: 'app-appointment-card',
  standalone: true,
  imports: [],
  templateUrl: './appointment-card.html',
})
export class AppointmentCardComponent {
  readonly appointment = input.required<AppointmentModel>();
  readonly onCancel    = output<number>();
  readonly onPay       = output<number>();

  readonly AppointmentStatus = AppointmentStatus;
  readonly formatDate    = formatAppointmentDate;
  readonly formatTime    = formatAppointmentTime;
  readonly isCancellable = isCancellable;

  readonly statusLabel: Record<AppointmentStatus, string> = {
    [AppointmentStatus.PENDING]:   'En attente de paiement',
    [AppointmentStatus.CONFIRMED]: 'Confirmé',
    [AppointmentStatus.COMPLETED]: 'Terminé',
    [AppointmentStatus.CANCELLED]: 'Annulé',
    [AppointmentStatus.EXPIRED]:   'Expiré',
  };

  readonly statusClass: Record<AppointmentStatus, string> = {
    [AppointmentStatus.PENDING]:   'bg-yellow-100 text-yellow-800',
    [AppointmentStatus.CONFIRMED]: 'bg-green-100 text-green-800',
    [AppointmentStatus.COMPLETED]: 'bg-gray-100 text-gray-700',
    [AppointmentStatus.CANCELLED]: 'bg-red-100 text-red-700',
    [AppointmentStatus.EXPIRED]:   'bg-orange-100 text-orange-700',
  };
}
