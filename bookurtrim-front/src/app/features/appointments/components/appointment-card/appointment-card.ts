import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgClass } from '@angular/common';
import { AppointmentStatus } from '../../enums';
import { formatAppointmentDate, formatAppointmentTime, isCancellable } from '../../mapper';
import type { AppointmentModel } from '../../models';
import type { ReviewModel } from '../../models/review.model';
import type { ReviewResponseDTO } from '../../dtos/review.dto';

@Component({
  selector: 'app-appointment-card',
  standalone: true,
  imports: [NgClass],
  templateUrl: './appointment-card.html',
})
export class AppointmentCardComponent implements OnInit {
  private readonly http = inject(HttpClient);

  readonly appointment = input.required<AppointmentModel>();
  readonly onCancel    = output<number>();
  readonly onPay       = output<number>();

  readonly AppointmentStatus = AppointmentStatus;
  readonly formatDate    = formatAppointmentDate;
  readonly formatTime    = formatAppointmentTime;
  readonly isCancellable = isCancellable;

  readonly review       = signal<ReviewModel | null>(null);
  readonly showForm     = signal(false);
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
    [AppointmentStatus.PENDING]:   'bg-yellow-100 text-yellow-800',
    [AppointmentStatus.CONFIRMED]: 'bg-green-100 text-green-800',
    [AppointmentStatus.COMPLETED]: 'bg-gray-100 text-gray-700',
    [AppointmentStatus.CANCELLED]: 'bg-red-100 text-red-700',
    [AppointmentStatus.EXPIRED]:   'bg-orange-100 text-orange-700',
  };

  readonly stars = [1, 2, 3, 4, 5];

  ngOnInit(): void {
    if (this.appointment().status === AppointmentStatus.COMPLETED) {
      this.http.get<ReviewResponseDTO>(`/appointments/${this.appointment().id}/review`).subscribe({
        next: (dto) => this.review.set(this._map(dto)),
        error: () => {},
      });
    }
  }

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
        this.review.set(this._map(dto));
        this.showForm.set(false);
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        if (err?.status === 409) {
          this.http.get<ReviewResponseDTO>(`/appointments/${this.appointment().id}/review`).subscribe({
            next: (dto) => { this.review.set(this._map(dto)); this.showForm.set(false); },
          });
        } else {
          this.reviewError.set('Une erreur est survenue.');
        }
      },
    });
  }

  private _map(dto: ReviewResponseDTO): ReviewModel {
    return { id: dto.id, appointmentId: dto.appointment_id, rating: dto.rating, comment: dto.comment, reviewedAt: dto.reviewed_at };
  }
}
