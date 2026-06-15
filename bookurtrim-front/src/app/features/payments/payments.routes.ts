import { Routes } from '@angular/router';

export const PAYMENT_ROUTES: Routes = [
  {
    path: ':appointmentId',
    loadComponent: () =>
      import('./pages/payment-page/payment-page').then(m => m.PaymentPage),
  },
];
