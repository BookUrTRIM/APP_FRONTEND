import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { App } from './app';
import { AuthApiContract } from './features/auth/services/auth.api.contract';
import { AuthApiService } from './features/auth/services/auth.api.service';
import { ServiceApiContract } from './features/services/services/service.api.contract';
import { ServiceApiService } from './features/services/services/service.api.service';
import { ProviderApiContract } from './features/provider-search/services/provider.api.contract';
import { ProviderApiService } from './features/provider-search/services/provider.api.service';
import { ClientProfileApiContract } from './features/client-profile/services/client-profile.api.contract';
import { ClientProfileApiService } from './features/client-profile/services/client-profile.api.service';
import { AppointmentApiContract } from './features/appointments/services/appointment.api.contract';
import { AppointmentApiService } from './features/appointments/services/appointment.api.service';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: AuthApiContract, useClass: AuthApiService },
        { provide: ServiceApiContract, useClass: ServiceApiService },
        { provide: ProviderApiContract, useClass: ProviderApiService },
        { provide: ClientProfileApiContract, useClass: ClientProfileApiService },
        { provide: AppointmentApiContract, useClass: AppointmentApiService },
      ],
    }).compileComponents();
  });

  it('devrait créer l\'application', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
