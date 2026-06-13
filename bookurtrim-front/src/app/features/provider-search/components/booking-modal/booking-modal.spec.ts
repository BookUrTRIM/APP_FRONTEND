import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { BookingModalComponent } from './booking-modal';
import { AppointmentApiContract } from '../../../appointments/services/appointment.api.contract';
import type { ServiceModel } from '../../../prestations/models';

const mockService: ServiceModel = {
  id: 1, providerId: 1, name: 'Coupe', description: null,
  basePrice: 20, defaultDuration: 30, createdAt: '', updatedAt: '',
};

class MockApi extends AppointmentApiContract {
  create           = vi.fn().mockReturnValue(of({ id: 99 }));
  listByClient     = vi.fn().mockReturnValue(of([]));
  listByProvider   = vi.fn().mockReturnValue(of([]));
  cancelByClient   = vi.fn().mockReturnValue(of({}));
  cancelByProvider = vi.fn().mockReturnValue(of({}));
  complete         = vi.fn().mockReturnValue(of({}));
}

describe('BookingModalComponent — logique', () => {
  let component: BookingModalComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingModalComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppointmentApiContract, useClass: MockApi },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(BookingModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('service', mockService);
    fixture.componentRef.setInput('providerId', 1);
  });

  it('crée le composant', () => expect(component).toBeTruthy());

  it('le formulaire contient les champs date et start_time', () => {
    expect(component.form.contains('date')).toBe(true);
    expect(component.form.contains('start_time')).toBe(true);
  });

  it('le formulaire est invalide sans start_time', () => {
    component.form.patchValue({ date: '2099-06-10', start_time: '' });
    expect(component.form.invalid).toBe(true);
  });

  it('le formulaire est valide avec date et start_time', () => {
    component.form.patchValue({ date: '2099-06-10', start_time: '09:00' });
    expect(component.form.valid).toBe(true);
  });

  it('isLoading est false initialement', () => {
    expect(component.isLoading()).toBe(false);
  });

  it('service() retourne le service passé en input', () => {
    expect(component.service().name).toBe('Coupe');
  });

  it('providerId() retourne l\'id passé en input', () => {
    expect(component.providerId()).toBe(1);
  });
});
