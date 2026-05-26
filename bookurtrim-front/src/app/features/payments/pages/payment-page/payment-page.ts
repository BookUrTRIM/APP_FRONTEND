import { Component, inject, OnInit, signal, ElementRef, ViewChild, AfterViewInit, NgZone, afterNextRender, Injector } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';
import { PaymentService } from '../../services/payment.service';
import { PaymentCardComponent } from '../../components/payment-card/payment-card';
import { PaymentStatus, PaymentType } from '../../enums';
import { environment } from '../../../../../environments/environment';

type PageStep = 'init' | 'stripe' | 'polling' | 'done' | 'failed';

@Component({
  selector: 'app-payment-page',
  standalone: true,
  imports: [PaymentCardComponent, CurrencyPipe],
  templateUrl: './payment-page.html',
})
export class PaymentPage implements OnInit, AfterViewInit {
  @ViewChild('cardElement') cardElementRef!: ElementRef<HTMLDivElement>;

  private readonly paymentService = inject(PaymentService);
  private readonly route          = inject(ActivatedRoute);
  private readonly router         = inject(Router);
  private readonly ngZone         = inject(NgZone);
  private readonly injector       = inject(Injector);

  private stripe: Stripe | null        = null;
  private cardElement: StripeCardElement | null = null;
  private clientSecret = '';
  private activePaymentId = 0;

  readonly isLoading    = this.paymentService.isLoading;
  readonly payments     = this.paymentService.payments;

  readonly step          = signal<PageStep>('init');
  readonly errorMessage  = signal('');
  readonly submitting    = signal(false);

  readonly PaymentStatus = PaymentStatus;

  appointmentId!: number;
  amount = 0;

  get hasDeposit(): boolean {
    return this.payments().some(p => p.paymentType === PaymentType.DEPOSIT);
  }

  get hasBalance(): boolean {
    return this.payments().some(p => p.paymentType === PaymentType.BALANCE);
  }

  get selectedType(): PaymentType {
    return this.hasDeposit ? PaymentType.BALANCE : PaymentType.DEPOSIT;
  }

  ngOnInit(): void {
    this.appointmentId = Number(this.route.snapshot.paramMap.get('appointmentId'));
    this.amount        = Number(this.route.snapshot.queryParamMap.get('amount') ?? 0);

    this.paymentService.loadByAppointment(this.appointmentId).subscribe({
      error: (err) => {
        const detail = err?.error?.detail ?? 'Erreur inconnue';
        this.errorMessage.set(`Impossible de charger les paiements. (${err?.status ?? ''} ${detail})`);
      },
    });
  }

  ngAfterViewInit(): void {
    loadStripe(environment.stripePublishableKey).then(stripe => {
      this.stripe = stripe;
    });
  }

  onInitiate(): void {
    this.submitting.set(true);
    this.errorMessage.set('');

    this.paymentService.initiate({
      appointment_id: this.appointmentId,
      amount: this.amount,
      payment_type: this.selectedType,
    }).subscribe({
      next: (payment) => {
        this.activePaymentId = payment.id;

        this.paymentService.prepare(payment.id).subscribe({
          next: (intent) => {
            this.clientSecret = intent.client_secret;
            this.submitting.set(false);
            this.step.set('stripe');
            afterNextRender(() => this._mountCard(), { injector: this.injector });
          },
          error: (err) => {
            this.submitting.set(false);
            const detail = err?.error?.detail ?? 'Erreur inconnue';
            this.errorMessage.set(`Erreur lors de la préparation Stripe. (${detail})`);
          },
        });
      },
      error: (err) => {
        this.submitting.set(false);
        if (err?.status === 409) {
          this.errorMessage.set('Un acompte a déjà été versé pour ce rendez-vous.');
        } else {
          const detail = err?.error?.detail ?? 'Erreur inconnue';
          this.errorMessage.set(`Erreur lors de l'initiation du paiement. (${detail})`);
        }
      },
    });
  }

  async onConfirmPayment(): Promise<void> {
    if (!this.stripe || !this.cardElement) return;

    this.submitting.set(true);
    this.errorMessage.set('');

    const { error, paymentIntent } = await this.stripe.confirmCardPayment(this.clientSecret, {
      payment_method: { card: this.cardElement },
    });

    if (error) {
      this.ngZone.run(() => {
        this.submitting.set(false);
        this.errorMessage.set(error.message ?? 'Le paiement a échoué.');
      });
      return;
    }

    this.ngZone.run(() => {
      this.submitting.set(false);
      if (paymentIntent?.status === 'succeeded') {
        this.step.set('done');
      } else {
        this.step.set('polling');
        this._startPolling();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/client/appointments']);
  }

  private _mountCard(): void {
    if (!this.stripe || !this.cardElementRef) return;

    const elements = this.stripe.elements();
    this.cardElement = elements.create('card', {
      style: {
        base: {
          fontFamily: 'Inter, sans-serif',
          fontSize: '15px',
          color: '#111827',
          '::placeholder': { color: '#9ca3af' },
        },
      },
    });
    this.cardElement.mount(this.cardElementRef.nativeElement);
  }

  private _startPolling(): void {
    this.paymentService.pollUntilResolved(this.activePaymentId).subscribe({
      next: (payment) => {
        if (payment.status !== PaymentStatus.PENDING) {
          this.ngZone.run(() => {
            this.step.set(payment.status === PaymentStatus.VALIDATED ? 'done' : 'failed');
          });
        }
      },
      error: () => {
        this.ngZone.run(() => {
          this.errorMessage.set('Impossible de vérifier le statut du paiement.');
        });
      },
    });
  }
}
