import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { ServiceModel } from '../../models';
import type { ServiceCreateDTO, ServiceUpdateDTO } from '../../dtos';

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './service-form.html',
})
export class ServiceFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  readonly service = input<ServiceModel | null>(null);
  readonly isLoading = input(false);
  readonly submitted = output<ServiceCreateDTO | ServiceUpdateDTO>();
  readonly cancelled = output<void>();

  readonly form = this.fb.nonNullable.group({
    name:             ['', [Validators.required, Validators.maxLength(100)]],
    description:      [''],
    base_price:       [0, [Validators.required, Validators.min(0)]],
    deposit_amount:   [0, [Validators.min(0)]],
    default_duration: [30, [Validators.required, Validators.min(1), Validators.max(480)]],
  });

  get name()            { return this.form.controls.name; }
  get basePrice()       { return this.form.controls.base_price; }
  get defaultDuration() { return this.form.controls.default_duration; }
  get isEdit(): boolean { return !!this.service(); }

  ngOnInit(): void {
    const s = this.service();
    if (s) {
      this.form.patchValue({
        name:             s.name,
        description:      s.description ?? '',
        base_price:       s.basePrice,
        deposit_amount:   s.depositAmount ?? 0,
        default_duration: s.defaultDuration,
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const raw = this.form.getRawValue();
    this.submitted.emit({
      name:             raw.name,
      description:      raw.description || null,
      base_price:       raw.base_price,
      deposit_amount:   raw.deposit_amount > 0 ? raw.deposit_amount : null,
      default_duration: raw.default_duration,
    });
  }
}
