import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr);

import { routes } from './app.routes';
import { apiInterceptor } from './core/interceptors/api.interceptor';
import { AuthApiContract } from './features/auth/services/auth.api.contract';
import { AuthApiService } from './features/auth/services/auth.api.service';
import { ServiceApiContract } from './features/prestations/services/service.api.contract';
import { ServiceApiService } from './features/prestations/services/service.api.service';
import { ProviderApiContract } from './features/provider-search/services/provider.api.contract';
import { ProviderApiService } from './features/provider-search/services/provider.api.service';
import { ClientProfileApiContract } from './features/client-profile/services/client-profile.api.contract';
import { ClientProfileApiService } from './features/client-profile/services/client-profile.api.service';
import { AppointmentApiContract } from './features/appointments/services/appointment.api.contract';
import { AppointmentApiService } from './features/appointments/services/appointment.api.service';
import { PaymentApiContract } from './features/payments/services/payment.api.contract';
import { PaymentApiService } from './features/payments/services/payment.api.service';
import { ServiceQuestionApiContract } from './features/prestations/services/service-question.api.contract';
import { ServiceQuestionApiService } from './features/prestations/services/service-question.api.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([apiInterceptor])),
    { provide: AuthApiContract, useClass: AuthApiService },
    { provide: ServiceApiContract, useClass: ServiceApiService },
    { provide: ProviderApiContract, useClass: ProviderApiService },
    { provide: ClientProfileApiContract, useClass: ClientProfileApiService },
    { provide: AppointmentApiContract, useClass: AppointmentApiService },
    { provide: PaymentApiContract, useClass: PaymentApiService },
    { provide: ServiceQuestionApiContract, useClass: ServiceQuestionApiService },
    { provide: LOCALE_ID, useValue: 'fr' },
  ],
};
