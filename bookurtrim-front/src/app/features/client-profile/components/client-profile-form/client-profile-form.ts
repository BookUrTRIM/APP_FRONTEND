import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Gender, HairLength, HairType } from '../../enums';
import type { ClientProfileModel } from '../../models';
import type { ClientProfileUpdateDTO } from '../../dtos';

@Component({
  selector: 'app-client-profile-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './client-profile-form.html',
})
export class ClientProfileFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  readonly profile = input.required<ClientProfileModel>();
  readonly isLoading = input(false);
  readonly submitted = output<ClientProfileUpdateDTO>();

  readonly Gender = Gender;
  readonly HairLength = HairLength;
  readonly HairType = HairType;

  readonly genderOptions = [
    { value: Gender.HOMME,  label: 'Homme' },
    { value: Gender.FEMME,  label: 'Femme' },
    { value: Gender.AUTRE,  label: 'Autre' },
  ];

  readonly hairLengthOptions = [
    { value: HairLength.COURT,     label: 'Court' },
    { value: HairLength.MI_LONG,   label: 'Mi-long' },
    { value: HairLength.LONG,      label: 'Long' },
    { value: HairLength.TRES_LONG, label: 'Très long' },
  ];

  readonly hairTypeOptions = [
    { value: HairType.LISSE,  label: 'Lisse' },
    { value: HairType.ONDULE, label: 'Ondulé' },
    { value: HairType.BOUCLE, label: 'Bouclé' },
    { value: HairType.CREPU,  label: 'Crépu' },
  ];

  readonly form = this.fb.nonNullable.group({
    first_name:          [''],
    last_name:           [''],
    phone:               [''],
    gender:              ['' as string],
    hair_length:         ['' as string],
    hair_type:           ['' as string],
    history_preferences: [''],
  });

  ngOnInit(): void {
    const p = this.profile();
    this.form.patchValue({
      first_name:          p.firstName,
      last_name:           p.lastName,
      phone:               p.phone ?? '',
      gender:              p.gender ?? '',
      hair_length:         p.hairLength ?? '',
      hair_type:           p.hairType ?? '',
      history_preferences: p.historyPreferences ?? '',
    });
  }

  onSubmit(): void {
    const raw = this.form.getRawValue();
    this.submitted.emit({
      first_name:          raw.first_name || undefined,
      last_name:           raw.last_name || undefined,
      phone:               raw.phone || null,
      gender:              raw.gender || null,
      hair_length:         raw.hair_length || null,
      hair_type:           raw.hair_type || null,
      history_preferences: raw.history_preferences || null,
    });
  }
}
