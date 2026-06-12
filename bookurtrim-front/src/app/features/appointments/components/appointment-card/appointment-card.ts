import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgClass } from '@angular/common';
import { AppointmentStatus } from '../../enums';
import { formatAppointmentDate, formatAppointmentTime, isCancellable } from '../../mapper';
import type { AppointmentModel } from '../../models';
import type { ReviewModel } from '../../models/review.model';
import type { InvoiceModel } from '../../models/invoice.model';
import type { ReviewResponseDTO } from '../../dtos/review.dto';
import type { InvoiceResponseDTO } from '../../dtos/invoice.dto';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-appointment-card',
  standalone: true,
  imports: [NgClass, StatusBadgeComponent],
  templateUrl: './appointment-card.html',
})
export class AppointmentCardComponent implements OnInit {
  private readonly http = inject(HttpClient);

  readonly appointment = input.required<AppointmentModel>();
  readonly onCancel     = output<number>();
  readonly onPay        = output<AppointmentModel>();
  readonly onPayBalance = output<AppointmentModel>();

  readonly AppointmentStatus = AppointmentStatus;
  readonly formatDate    = formatAppointmentDate;
  readonly formatTime    = formatAppointmentTime;
  readonly isCancellable = isCancellable;

  readonly review           = signal<ReviewModel | null>(null);
  readonly invoice          = signal<InvoiceModel | null>(null);
  readonly balancePaid      = signal(false);
  readonly balanceSettled   = signal(false);
  readonly showForm         = signal(false);

  readonly showBalanceChoice = computed(() => {
    const a = this.appointment();
    return (
      a.status === AppointmentStatus.COMPLETED &&
      a.depositAmount !== null && a.depositAmount > 0 &&
      a.serviceBasePrice !== null && a.serviceBasePrice > a.depositAmount &&
      !this.balancePaid() &&
      !this.balanceSettled()
    );
  });
  readonly rating       = signal(0);
  readonly comment      = signal('');
  readonly isSubmitting = signal(false);
  readonly reviewError  = signal('');

  readonly statusLabel: Record<AppointmentStatus, string> = {
    [AppointmentStatus.PENDING]:   'En attente de paiement',
    [AppointmentStatus.CONFIRMED]: 'Confirmé',
    [AppointmentStatus.COMPLETED]: 'Terminé',
    [AppointmentStatus.CANCELLED]: 'Annulé',
    [AppointmentStatus.EXPIRED]:   'Expiré',
  };

  readonly statusClass: Record<AppointmentStatus, string> = {
    [AppointmentStatus.PENDING]:   'bg-gold/10 text-chocolate border border-gold/20',
    [AppointmentStatus.CONFIRMED]: 'bg-rose/15 text-rose',
    [AppointmentStatus.COMPLETED]: 'bg-beige/40 text-taupe',
    [AppointmentStatus.CANCELLED]: 'bg-bordeaux/15 text-bordeaux',
    [AppointmentStatus.EXPIRED]:   'bg-bordeaux/10 text-bordeaux',
  };

  readonly stars = [1, 2, 3, 4, 5];

  ngOnInit(): void {
    if (this.appointment().status === AppointmentStatus.COMPLETED) {
      this.http.get<ReviewResponseDTO>(`/appointments/${this.appointment().id}/review`).subscribe({
        next: (dto) => this.review.set(this._mapReview(dto)),
        error: () => {},
      });
      this.http.get<InvoiceResponseDTO>(`/appointments/${this.appointment().id}/invoice`).subscribe({
        next: (dto) => this.invoice.set({ id: dto.id, appointmentId: dto.appointment_id, totalAmount: dto.total_amount, issuedAt: dto.issued_at, pdfUrl: dto.pdf_url }),
        error: () => {},
      });
      if (this.appointment().depositAmount && this.appointment().serviceBasePrice) {
        this.http.get<any[]>(`/payments/appointment/${this.appointment().id}`).subscribe({
          next: (payments) => {
            const hasValidatedBalance = payments.some(
              p => p.payment_type === 'balance' && p.status === 'validated'
            );
            this.balancePaid.set(hasValidatedBalance);
          },
          error: () => {},
        });
      }
    }
  }

  settleLocally(): void { this.balanceSettled.set(true); }

  openForm(): void { this.showForm.set(true); }
  cancelForm(): void { this.showForm.set(false); this.rating.set(0); this.comment.set(''); this.reviewError.set(''); }
  setRating(r: number): void { this.rating.set(r); }

  submitReview(): void {
    if (this.rating() === 0) return;
    this.isSubmitting.set(true);
    this.reviewError.set('');

    const body: { appointment_id: number; rating: number; comment?: string } = {
      appointment_id: this.appointment().id,
      rating: this.rating(),
    };
    if (this.comment().trim()) body.comment = this.comment().trim();

    this.http.post<ReviewResponseDTO>(`/appointments/${this.appointment().id}/review`, body).subscribe({
      next: (dto) => {
        this.review.set(this._mapReview(dto));
        this.showForm.set(false);
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        if (err?.status === 409) {
          this.http.get<ReviewResponseDTO>(`/appointments/${this.appointment().id}/review`).subscribe({
            next: (dto) => { this.review.set(this._mapReview(dto)); this.showForm.set(false); },
          });
        } else {
          this.reviewError.set('Une erreur est survenue.');
        }
      },
    });
  }

  private _mapReview(dto: ReviewResponseDTO): ReviewModel {
    return { id: dto.id, appointmentId: dto.appointment_id, rating: dto.rating, comment: dto.comment, reviewedAt: dto.reviewed_at };
  }
}
