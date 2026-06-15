import { mapPaymentDTOToModel } from './payment.mapper';
import { PaymentType, PaymentStatus } from '../enums';
import type { PaymentResponseDTO } from '../dtos';

const MOCK_DTO: PaymentResponseDTO = {
  id: 1,
  appointment_id: 5,
  amount: 25,
  currency: 'eur',
  payment_type: 'deposit',
  status: 'validated',
  paid_at: '2026-06-01T10:00:00Z',
  stripe_payment_intent_id: 'pi_123',
  stripe_charge_id: 'ch_456',
  stripe_metadata: null,
};

describe('mapPaymentDTOToModel', () => {
  it('mappe correctement tous les champs', () => {
    const model = mapPaymentDTOToModel(MOCK_DTO);
    expect(model.id).toBe(1);
    expect(model.appointmentId).toBe(5);
    expect(model.amount).toBe(25);
    expect(model.currency).toBe('eur');
    expect(model.paymentType).toBe(PaymentType.DEPOSIT);
    expect(model.status).toBe(PaymentStatus.VALIDATED);
    expect(model.paidAt).toBe('2026-06-01T10:00:00Z');
    expect(model.stripePaymentIntentId).toBe('pi_123');
    expect(model.stripeChargeId).toBe('ch_456');
  });

  it('mappe payment_type balance', () => {
    const model = mapPaymentDTOToModel({ ...MOCK_DTO, payment_type: 'balance' });
    expect(model.paymentType).toBe(PaymentType.BALANCE);
  });

  it('mappe status pending', () => {
    const model = mapPaymentDTOToModel({ ...MOCK_DTO, status: 'pending' });
    expect(model.status).toBe(PaymentStatus.PENDING);
  });

  it('mappe status refunded', () => {
    const model = mapPaymentDTOToModel({ ...MOCK_DTO, status: 'refunded' });
    expect(model.status).toBe(PaymentStatus.REFUNDED);
  });

  it('gère paid_at null', () => {
    const model = mapPaymentDTOToModel({ ...MOCK_DTO, paid_at: null });
    expect(model.paidAt).toBeNull();
  });
});
