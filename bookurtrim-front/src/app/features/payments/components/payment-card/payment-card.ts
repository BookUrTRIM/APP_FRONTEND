import { Component, input } from '@angular/core';
import { PaymentStatus, PaymentType } from '../../enums';
import type { PaymentModel } from '../../models';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-payment-card',
  standalone: true,
  imports: [StatusBadgeComponent],
  templateUrl: './payment-card.html',
})
export class PaymentCardComponent {
  readonly payment     = input.required<PaymentModel>();
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
    [PaymentStatus.PENDING]:   'bg-gold/10 text-chocolate border border-gold/20',
    [PaymentStatus.VALIDATED]: 'bg-rose/15 text-rose',
    [PaymentStatus.FAILED]:    'bg-bordeaux/15 text-bordeaux',
    [PaymentStatus.REFUNDED]:  'bg-beige/40 text-taupe',
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
