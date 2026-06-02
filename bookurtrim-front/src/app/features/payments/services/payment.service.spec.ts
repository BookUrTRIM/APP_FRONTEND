import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { vi } from 'vitest';
import { PaymentService } from './payment.service';
import { PaymentApiContract } from './payment.api.contract';
import { PaymentStatus, PaymentType } from '../enums';
import type { PaymentResponseDTO } from '../dtos';

const makeDTO = (overrides: Partial<PaymentResponseDTO> = {}): PaymentResponseDTO => ({
  id: 1, appointment_id: 5, amount: 25, currency: 'eur',
  payment_type: 'deposit', status: 'validated',
  paid_at: '2026-06-01T10:00:00Z',
  stripe_payment_intent_id: 'pi_123', stripe_charge_id: null, stripe_metadata: null,
  ...overrides,
});

class MockApi extends PaymentApiContract {
  create              = vi.fn().mockReturnValue(of(makeDTO()));
  getById             = vi.fn().mockReturnValue(of(makeDTO()));
  listByAppointment   = vi.fn().mockReturnValue(of([makeDTO()]));
  prepare             = vi.fn().mockReturnValue(of({ payment_id: 1, client_secret: 'secret_123' }));
  refundByAppointment = vi.fn().mockReturnValue(of(makeDTO({ status: 'refunded' })));
}

describe('PaymentService', () => {
  let service: PaymentService;
  let mockApi: MockApi;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PaymentService,
        { provide: PaymentApiContract, useClass: MockApi },
      ],
    });
    service = TestBed.inject(PaymentService);
    mockApi = TestBed.inject(PaymentApiContract) as MockApi;
  });

  it('crée le service', () => expect(service).toBeTruthy());

  describe('loadByAppointment', () => {
    it('charge et stocke les paiements', async () => {
      await firstValueFrom(service.loadByAppointment(5));
      expect(service.payments().length).toBe(1);
      expect(service.payments()[0].appointmentId).toBe(5);
    });

    it('filtre les paiements validés', async () => {
      await firstValueFrom(service.loadByAppointment(5));
      expect(service.validated().length).toBe(1);
      expect(service.pending().length).toBe(0);
    });

    it('filtre les paiements en attente', async () => {
      mockApi.listByAppointment = vi.fn().mockReturnValue(of([makeDTO({ status: 'pending' })]));
      await firstValueFrom(service.loadByAppointment(5));
      expect(service.pending().length).toBe(1);
      expect(service.validated().length).toBe(0);
    });
  });

  describe('initiate', () => {
    it('ajoute le paiement à la liste locale', async () => {
      const payment = await firstValueFrom(service.initiate({
        appointment_id: 5, amount: 25, payment_type: PaymentType.DEPOSIT,
      }));
      expect(payment.amount).toBe(25);
      expect(service.payments().some(p => p.id === 1)).toBe(true);
    });
  });

  describe('refundByAppointment', () => {
    it('met à jour le paiement localement après remboursement', async () => {
      await firstValueFrom(service.loadByAppointment(5));
      await firstValueFrom(service.refundByAppointment(5));
      const p = service.payments().find(p => p.id === 1);
      expect(p?.status).toBe(PaymentStatus.REFUNDED);
    });

    it('ne remplace que le paiement remboursé quand il y en a plusieurs', async () => {
      service['_payments'].set([
        { id: 1, appointmentId: 5, amount: 10, currency: 'eur', paymentType: PaymentType.DEPOSIT, status: PaymentStatus.VALIDATED, paidAt: null, stripePaymentIntentId: null, stripeChargeId: null, stripeMetadata: null },
        { id: 2, appointmentId: 5, amount: 15, currency: 'eur', paymentType: PaymentType.BALANCE, status: PaymentStatus.VALIDATED, paidAt: null, stripePaymentIntentId: null, stripeChargeId: null, stripeMetadata: null },
      ]);
      await firstValueFrom(service.refundByAppointment(5));
      expect(service.payments().find(p => p.id === 1)?.status).toBe(PaymentStatus.REFUNDED);
      expect(service.payments().find(p => p.id === 2)?.status).toBe(PaymentStatus.VALIDATED);
    });
  });
});
