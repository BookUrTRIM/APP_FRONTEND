import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {PlanningFormValue} from '../../models/availability.model';


@Component({
  selector: 'app-planning-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './planning-form.html'
})
export class PlanningFormComponent {
  @Input() isLoading = false;
  @Output() onSubmit = new EventEmitter<PlanningFormValue>();
  @Output() onAbsence = new EventEmitter<string>();

  private fb = inject(FormBuilder);
  weekDays = [
    { value: 1, label: 'L' }, { value: 2, label: 'M' },
    { value: 3, label: 'M' }, { value: 4, label: 'J' },
    { value: 5, label: 'V' }, { value: 6, label: 'S' },
    { value: 0, label: 'D' }
  ];

  form = this.fb.nonNullable.group({
    start_date: ['', Validators.required],
    days_of_week: [[] as number[], [Validators.required, Validators.minLength(1)]],
    start_time: ['09:00', Validators.required],
    end_time: ['18:00', Validators.required],
    slot_type: ['work' as 'work' | 'break', Validators.required],
    recurring_weeks: [1, [Validators.min(1), Validators.max(52)]]
  });

  get selectedDays(): number[] {
    return this.form.get('days_of_week')?.value || [];
  }

  toggleDay(dayValue: number) {
    const current = [...this.selectedDays];
    const index = current.indexOf(dayValue);

    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(dayValue);
    }
    this.form.patchValue({ days_of_week: current });
  }

  submit() {
    if (this.form.valid) {
      this.onSubmit.emit(this.form.getRawValue());
      this.form.patchValue({ days_of_week: [] });
    }
  }

  markAbsence() {
    const date = this.form.get('start_date')?.value;
    if (date) this.onAbsence.emit(date);
    else alert('Veuillez d\'abord choisir une date de début !');
  }
}
