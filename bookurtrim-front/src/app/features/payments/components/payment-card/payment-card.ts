import { Component, input } from '@angular/core';
import { PaymentStatus, PaymentType } from '../../enums';
import type { PaymentModel } from '../../models';

@Component({
  selector: 'app-payment-card',
  standalone: true,
  imports: [],
  templateUrl: './payment-card.html',
})
export class PaymentCardComponent {
  readonly payment = input.required<PaymentModel>();

  readonly PaymentStatus = PaymentStatus;

  readonly typeLabel: Record<PaymentType, string> = {
    [PaymentType.DEPOSIT]: 'Acompte',
    [PaymentType.BALANCE]: 'Solde',
  };

  readonly statusLabel: Record<PaymentStatus, string> = {
    [PaymentStatus.PENDING]:   'En attente',
    [PaymentStatus.VALIDATED]: 'Validé',
    [PaymentStatus.FAILED]:    'Échoué',
    [PaymentStatus.REFUNDED]:  'Remboursé',
  };

  readonly statusClass: Record<PaymentStatus, string> = {
    [PaymentStatus.PENDING]:   'bg-yellow-100 text-yellow-800',
    [PaymentStatus.VALIDATED]: 'bg-green-100 text-green-800',
    [PaymentStatus.FAILED]:    'bg-red-100 text-red-700',
    [PaymentStatus.REFUNDED]:  'bg-gray-100 text-gray-600',
  };

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  }
}
