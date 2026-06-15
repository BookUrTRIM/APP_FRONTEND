import { Component, inject, input, output, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentApiContract } from '../../../appointments/services/appointment.api.contract';
import type { ServiceModel } from '../../../prestations/models';

@Component({
  selector: 'app-booking-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './booking-modal.html',
})
export class BookingModalComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly appointmentApi = inject(AppointmentApiContract);
  private readonly router = inject(Router);

  readonly service = input.required<ServiceModel>();
  readonly providerId = input.required<number>();
  readonly closed = output<void>();

  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  readonly today = new Date().toISOString().split('T')[0];

  readonly form = this.fb.nonNullable.group({
    date:       ['', Validators.required],
    start_time: ['', Validators.required],
  });

  ngOnInit(): void {
    this.form.patchValue({ date: this.today });
  }

  private buildISODateTime(date: string, time: string): string {
    return `${date}T${time}:00Z`;
  }

  private addMinutes(isoDate: string, minutes: number): string {
    const d = new Date(isoDate);
    d.setMinutes(d.getMinutes() + minutes);
    return d.toISOString().slice(0, 19) + 'Z';
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const { date, start_time } = this.form.getRawValue();
    const startISO = this.buildISODateTime(date, start_time);
    const endISO   = this.addMinutes(startISO, this.service().defaultDuration);

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.appointmentApi.create({
      provider_id: this.providerId(),
      service_id:  this.service().id,
      start_at:    startISO,
      end_at:      endISO,
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/client/appointments']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err?.error?.detail ?? 'Une erreur est survenue.');
      },
    });
  }

  onClose(): void { this.closed.emit(); }
}
