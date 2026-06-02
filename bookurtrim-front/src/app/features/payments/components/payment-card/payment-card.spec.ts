import { TestBed } from '@angular/core/testing';
import { PaymentCardComponent } from './payment-card';
import { PaymentStatus, PaymentType } from '../../enums';
import type { PaymentModel } from '../../models';

const makePayment = (overrides: Partial<PaymentModel> = {}): PaymentModel => ({
  id: 1, appointmentId: 5, amount: 25, currency: 'eur',
  paymentType: PaymentType.DEPOSIT, status: PaymentStatus.VALIDATED,
  paidAt: '2026-06-01T10:00:00Z',
  stripePaymentIntentId: 'pi_123', stripeChargeId: null, stripeMetadata: null,
  ...overrides,
});

describe('PaymentCardComponent — logique', () => {
  let component: PaymentCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentCardComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(PaymentCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('payment', makePayment());
  });

  it('crée le composant', () => expect(component).toBeTruthy());

  it('typeLabel contient les deux types', () => {
    expect(component.typeLabel[PaymentType.DEPOSIT]).toBe('Acompte');
    expect(component.typeLabel[PaymentType.BALANCE]).toBe('Solde');
  });

  it('statusLabel contient tous les statuts', () => {
    expect(component.statusLabel[PaymentStatus.VALIDATED]).toBe('Validé');
    expect(component.statusLabel[PaymentStatus.PENDING]).toBe('En attente');
    expect(component.statusLabel[PaymentStatus.FAILED]).toBe('Échoué');
    expect(component.statusLabel[PaymentStatus.REFUNDED]).toBe('Remboursé');
  });

  it('formatAmount formate en euros', () => {
    expect(component.formatAmount(25)).toContain('25');
    expect(component.formatAmount(25)).toContain('€');
  });

  it('formatAmount gère les décimales', () => {
    const result = component.formatAmount(14.50);
    expect(result).toContain('14');
  });

  it('formatDate retourne une date lisible avec l\'année', () => {
    const result = component.formatDate('2026-06-01T10:00:00Z');
    expect(result).toContain('2026');
  });

  it('payment() retourne le payment passé en input', () => {
    expect(component.payment().id).toBe(1);
    expect(component.payment().amount).toBe(25);
    expect(component.payment().status).toBe(PaymentStatus.VALIDATED);
  });
});
