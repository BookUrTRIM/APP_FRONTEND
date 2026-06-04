import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DatePipe, NgClass } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppointmentApiContract } from '../../../appointments/services/appointment.api.contract';
import { mapProviderDTOToModel, getProviderFullName } from '../../mapper';
import { mapServiceDTOToModel, mapServiceQuestionDTOToModel } from '../../../services/mapper';
import type { ProviderModel } from '../../models';
import type { ServiceModel, ServiceQuestionModel } from '../../../services/models';
import type { AvailabilityResponseDTO } from '../../../../core/models/availability.models';
import type { ProviderResponseDTO } from '../../dtos';
import type { ServiceResponseDTO, ServiceQuestionResponseDTO } from '../../../services/dtos';

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [DatePipe, NgClass],
  templateUrl: './booking-page.html',
})
export class BookingPage implements OnInit {
  private readonly route          = inject(ActivatedRoute);
  private readonly router         = inject(Router);
  private readonly http           = inject(HttpClient);
  private readonly appointmentApi = inject(AppointmentApiContract);

  readonly provider       = signal<ProviderModel | null>(null);
  readonly service        = signal<ServiceModel | null>(null);
  readonly availabilities = signal<AvailabilityResponseDTO[]>([]);
  readonly questions      = signal<ServiceQuestionModel[]>([]);
  readonly isLoading      = signal(true);
  readonly isBooking      = signal(false);
  readonly isCalculating  = signal(false);
  readonly errorMessage   = signal('');
  readonly successMessage = signal('');

  readonly selectedDate    = signal<string>('');
  readonly selectedSlot    = signal<string>('');
  readonly specificRequest = signal<string>('');

  readonly answers            = signal<Record<number, number>>({});
  readonly calculatedDuration = signal(0);
  readonly questionsConfirmed = signal(false);

  readonly showQuestionnaire = computed(() =>
    this.questions().length > 0 && !this.questionsConfirmed()
  );

  readonly allAnswered = computed(() => {
    const qs  = this.questions();
    const ans = this.answers();
    return qs.length === 0 || qs.every(q => ans[q.id] !== undefined);
  });

  readonly today = new Date();
  currentWeekStart!: Date;
  weekDays: Date[] = [];

  readonly getFullName = getProviderFullName;

  get providerId(): number { return Number(this.route.snapshot.paramMap.get('id')); }
  get serviceId(): number  { return Number(this.route.snapshot.queryParamMap.get('serviceId')); }

  readonly availableDates = computed(() => {
    const workDates = this.availabilities()
      .filter(a => a.slot_type === 'work' && a.day_date >= this._dateStr(this.today))
      .map(a => a.day_date);
    return new Set(workDates);
  });

  readonly slotsForDay = computed(() => {
    const date     = this.selectedDate();
    const duration = this.calculatedDuration() > 0
      ? this.calculatedDuration()
      : (this.service()?.defaultDuration ?? 30);
    if (!date) return [] as { time: string; available: boolean }[];
    return this._generateSlots(date, duration);
  });

  ngOnInit(): void {
    this.currentWeekStart = this._getStartOfWeek(new Date());
    this._generateWeekDays();

    forkJoin({
      provider:  this.http.get<ProviderResponseDTO>(`/providers/${this.providerId}`),
      service:   this.http.get<ServiceResponseDTO>(`/services/${this.serviceId}`),
      avails:    this.http.get<AvailabilityResponseDTO[]>(`/providers/${this.providerId}/availabilities`),
      questions: this.http.get<ServiceQuestionResponseDTO[]>(`/services/${this.serviceId}/questions`).pipe(
        catchError(() => of([] as ServiceQuestionResponseDTO[]))
      ),
    }).subscribe({
      next: ({ provider, service, avails, questions }) => {
        this.provider.set(mapProviderDTOToModel(provider));
        const svc = mapServiceDTOToModel(service);
        this.service.set(svc);
        this.calculatedDuration.set(svc.defaultDuration);
        const list = Array.isArray(avails) ? avails : (avails as { items?: AvailabilityResponseDTO[] })?.items ?? [];
        this.availabilities.set(list);
        const qList = Array.isArray(questions) ? questions : [];
        this.questions.set(qList.map(mapServiceQuestionDTOToModel));
        if (qList.length === 0) this.questionsConfirmed.set(true);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Impossible de charger les disponibilités.');
        this.isLoading.set(false);
      },
    });
  }

  selectAnswer(questionId: number, optionIndex: number): void {
    this.answers.update(prev => ({ ...prev, [questionId]: optionIndex }));
  }

  isOptionSelected(questionId: number, optionIndex: number): boolean {
    return this.answers()[questionId] === optionIndex;
  }

  confirmAnswers(): void {
    const answersPayload = Object.entries(this.answers()).map(([qId, optIdx]) => ({
      question_id:  Number(qId),
      option_index: optIdx,
    }));

    this.isCalculating.set(true);
    this.http.post<{ duration: number }>(`/services/${this.serviceId}/calculate-duration`, {
      answers: answersPayload,
    }).subscribe({
      next: (res) => {
        this.calculatedDuration.set(res.duration);
        this.questionsConfirmed.set(true);
        this.isCalculating.set(false);
      },
      error: () => {
        this.calculatedDuration.set(this.service()!.defaultDuration);
        this.questionsConfirmed.set(true);
        this.isCalculating.set(false);
      },
    });
  }

  resetQuestionnaire(): void {
    this.questionsConfirmed.set(false);
    this.selectedDate.set('');
    this.selectedSlot.set('');
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
    const str = this._dateStr(date);
    if (!this.availableDates().has(str)) return;
    this.selectedDate.set(str);
    this.selectedSlot.set('');
  }

  selectSlot(slot: string): void { this.selectedSlot.set(slot); }

  isToday(date: Date): boolean {
    return this._dateStr(date) === this._dateStr(this.today);
  }

  isSelected(date: Date): boolean {
    return this._dateStr(date) === this.selectedDate();
  }

  isAvailable(date: Date): boolean {
    return this.availableDates().has(this._dateStr(date));
  }

  getSlotsForCalendar(date: Date): AvailabilityResponseDTO[] {
    return this.availabilities().filter(a => a.day_date === this._dateStr(date));
  }

  confirmBooking(): void {
    if (!this.selectedDate() || !this.selectedSlot()) return;
    const startISO = `${this.selectedDate()}T${this.selectedSlot()}:00Z`;
    const duration = this.calculatedDuration() > 0
      ? this.calculatedDuration()
      : (this.service()?.defaultDuration ?? 30);
    const endISO   = this._addMinutes(startISO, duration);

    const answersPayload = Object.entries(this.answers()).map(([qId, optIdx]) => {
      const q   = this.questions().find(q => q.id === Number(qId));
      const opt = q?.options[optIdx as number];
      return { question: q?.question ?? '', answer: opt?.label ?? '', extra_minutes: opt?.extraMinutes ?? 0 };
    });

    this.isBooking.set(true);
    this.errorMessage.set('');

    this.appointmentApi.create({
      provider_id:      this.providerId,
      service_id:       this.serviceId,
      start_at:         startISO,
      end_at:           endISO,
      specific_request: this.specificRequest() || null,
      answers:          answersPayload.length > 0 ? answersPayload : undefined,
    }).subscribe({
      next: (appointment) => {
        this.isBooking.set(false);
        this.router.navigate(['/client/payments', appointment.id], {
          queryParams: { amount: this.service()!.depositAmount ?? this.service()!.basePrice ?? 0 },
        });
      },
      error: (err) => {
        this.isBooking.set(false);
        if (err?.status === 409) {
          this.errorMessage.set('Ce créneau vient d\'être réservé. Veuillez en choisir un autre.');
          this.selectedSlot.set('');
        } else {
          this.errorMessage.set(err?.error?.detail ?? 'Une erreur est survenue.');
        }
      },
    });
  }

  goBack(): void { this.router.navigate(['/client/providers', this.providerId]); }

  /* ── helpers ── */
  private _generateSlots(date: string, duration: number): { time: string; available: boolean }[] {
    const daySlots  = this.availabilities().filter(a => a.day_date === date);
    const workSlots = daySlots.filter(a => a.slot_type === 'work');
    const breaks    = daySlots.filter(a => a.slot_type === 'break');
    const booked    = daySlots.filter(a => a.slot_type === 'booked');
    const result: { time: string; available: boolean }[] = [];
    const todayStr  = this._dateStr(this.today);
    const nowMins   = date === todayStr ? this.today.getHours() * 60 + this.today.getMinutes() : 0;

    for (const work of workSlots) {
      let cur = this._timeToMins(work.start_time);
      const end = this._timeToMins(work.end_time);
      while (cur + duration <= end) {
        const slotEnd  = cur + duration;
        const inPast   = date === todayStr && cur <= nowMins;
        const inBreak  = breaks.some(b => cur < this._timeToMins(b.end_time) && slotEnd > this._timeToMins(b.start_time));
        const inBooked = booked.some(b => cur <= this._timeToMins(b.end_time) && slotEnd > this._timeToMins(b.start_time));
        if (!inPast && !inBreak) {
          result.push({ time: this._minsToTime(cur), available: !inBooked });
        }
        cur += 30;
      }
    }
    return result.sort((a, b) => a.time.localeCompare(b.time));
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
    const day  = date.getDay();
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

  private _dateStr(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
