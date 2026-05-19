import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DatePipe, NgClass } from '@angular/common';
import { forkJoin } from 'rxjs';
import { AppointmentApiContract } from '../../../appointments/services/appointment.api.contract';
import { mapProviderDTOToModel, getProviderFullName } from '../../mapper';
import { mapServiceDTOToModel } from '../../../services/mapper';
import type { ProviderModel } from '../../models';
import type { ServiceModel } from '../../../services/models';
import type { AvailabilityResponseDTO } from '../../../../core/models/availability.models';
import type { ProviderResponseDTO } from '../../dtos';
import type { ServiceResponseDTO } from '../../../services/dtos';

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [DatePipe, NgClass],
  templateUrl: './booking-page.html',
})
export class BookingPage implements OnInit {
  private readonly route  = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly http   = inject(HttpClient);
  private readonly appointmentApi = inject(AppointmentApiContract);

  readonly provider      = signal<ProviderModel | null>(null);
  readonly service       = signal<ServiceModel | null>(null);
  readonly availabilities = signal<AvailabilityResponseDTO[]>([]);
  readonly isLoading     = signal(true);
  readonly isBooking     = signal(false);
  readonly errorMessage  = signal('');
  readonly successMessage = signal('');

  readonly selectedDate     = signal<string>('');
  readonly selectedSlot     = signal<string>('');
  readonly specificRequest  = signal<string>('');

  readonly today = new Date();
  currentWeekStart!: Date;
  weekDays: Date[] = [];

  readonly getFullName = getProviderFullName;

  get providerId(): number { return Number(this.route.snapshot.paramMap.get('id')); }
  get serviceId(): number  { return Number(this.route.snapshot.queryParamMap.get('serviceId')); }

  readonly availableDates = computed(() => {
    const workDates = this.availabilities()
      .filter(a => a.slot_type === 'work' && a.day_date >= this.today.toISOString().split('T')[0])
      .map(a => a.day_date);
    return new Set(workDates);
  });

  readonly slotsForDay = computed(() => {
    const date = this.selectedDate();
    const duration = this.service()?.defaultDuration ?? 30;
    if (!date) return [];
    return this._generateSlots(date, duration);
  });

  ngOnInit(): void {
    this.currentWeekStart = this._getStartOfWeek(new Date());
    this._generateWeekDays();

    forkJoin({
      provider: this.http.get<ProviderResponseDTO>(`/providers/${this.providerId}`),
      service:  this.http.get<ServiceResponseDTO>(`/services/${this.serviceId}`),
      avails:   this.http.get<AvailabilityResponseDTO[]>(`/providers/${this.providerId}/availabilities`),
    }).subscribe({
      next: ({ provider, service, avails }) => {
        this.provider.set(mapProviderDTOToModel(provider));
        this.service.set(mapServiceDTOToModel(service));
        const list = Array.isArray(avails) ? avails : (avails as { items?: AvailabilityResponseDTO[] })?.items ?? [];
        this.availabilities.set(list);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Impossible de charger les disponibilités.');
        this.isLoading.set(false);
      },
    });
  }

  previousWeek(): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
    this._generateWeekDays();
  }

  nextWeek(): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
    this._generateWeekDays();
  }

  resetWeek(): void {
    this.currentWeekStart = this._getStartOfWeek(new Date());
    this._generateWeekDays();
  }

  selectDate(date: Date): void {
    const str = date.toISOString().split('T')[0];
    if (!this.availableDates().has(str)) return;
    this.selectedDate.set(str);
    this.selectedSlot.set('');
  }

  selectSlot(slot: string): void { this.selectedSlot.set(slot); }

  isToday(date: Date): boolean {
    return date.toISOString().split('T')[0] === this.today.toISOString().split('T')[0];
  }

  isSelected(date: Date): boolean {
    return date.toISOString().split('T')[0] === this.selectedDate();
  }

  isAvailable(date: Date): boolean {
    return this.availableDates().has(date.toISOString().split('T')[0]);
  }

  getSlotsForCalendar(date: Date): AvailabilityResponseDTO[] {
    const str = date.toISOString().split('T')[0];
    return this.availabilities().filter(a => a.day_date === str);
  }

  confirmBooking(): void {
    if (!this.selectedDate() || !this.selectedSlot()) return;
    const startISO = `${this.selectedDate()}T${this.selectedSlot()}:00Z`;
    const endISO   = this._addMinutes(startISO, this.service()!.defaultDuration);

    this.isBooking.set(true);
    this.errorMessage.set('');

    this.appointmentApi.create({
      provider_id:      this.providerId,
      start_at:       startISO,
      end_at:         endISO,
      specific_request: this.specificRequest() || null,
    }).subscribe({
      next: () => {
        this.isBooking.set(false);
        this.successMessage.set('Rendez-vous réservé avec succès !');
        setTimeout(() => this.router.navigate(['/client/appointments']), 1500);
      },
      error: (err) => {
        this.isBooking.set(false);
        this.errorMessage.set(err?.error?.detail ?? 'Une erreur est survenue.');
      },
    });
  }

  goBack(): void { this.router.navigate(['/client/providers', this.providerId]); }

  /* ── helpers ── */
  private _generateSlots(date: string, duration: number): string[] {
    const daySlots  = this.availabilities().filter(a => a.day_date === date);
    const workSlots = daySlots.filter(a => a.slot_type === 'work');
    const breaks    = daySlots.filter(a => a.slot_type === 'break');
    const result: string[] = [];
    const todayStr  = this.today.toISOString().split('T')[0];
    const nowMins   = date === todayStr ? this.today.getHours() * 60 + this.today.getMinutes() : 0;

    for (const work of workSlots) {
      let cur = this._timeToMins(work.start_time);
      const end = this._timeToMins(work.end_time);
      while (cur + duration <= end) {
        const slotEnd = cur + duration;
        const inPast = date === todayStr && cur <= nowMins;
        const inBreak = breaks.some(b => cur < this._timeToMins(b.end_time) && slotEnd > this._timeToMins(b.start_time));
        if (!inPast && !inBreak) result.push(this._minsToTime(cur));
        cur += 30;
      }
    }
    return result.sort();
  }

  private _timeToMins(t: string): number {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  }

  private _minsToTime(m: number): string {
    return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
  }

  private _addMinutes(iso: string, mins: number): string {
    const d = new Date(iso);
    d.setMinutes(d.getMinutes() + mins);
    return d.toISOString().slice(0, 19) + 'Z';
  }

  private _getStartOfWeek(d: Date): Date {
    const date = new Date(d);
    const day = date.getDay();
    date.setDate(date.getDate() - day + (day === 0 ? -6 : 1));
    date.setHours(0, 0, 0, 0);
    return date;
  }

  private _generateWeekDays(): void {
    this.weekDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(this.currentWeekStart);
      d.setDate(d.getDate() + i);
      return d;
    });
  }
}
