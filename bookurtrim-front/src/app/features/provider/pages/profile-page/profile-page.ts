import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProviderAccountService } from '../../services/provider-account.service';
import type { ProviderAccountUpdateDTO } from '../../dtos';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile-page.html',
})
export class ProfilePage implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly fb   = inject(FormBuilder);
  private readonly providerAccountService = inject(ProviderAccountService);

  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  readonly isLoading      = signal(true);
  readonly isSaving       = signal(false);
  readonly successMessage = signal('');
  readonly errorMessage   = signal('');
  readonly suggestions    = signal<string[]>([]);
  readonly showSuggestions = signal(false);

  readonly form = this.fb.nonNullable.group({
    phone:         [''],
    business_name: ['', Validators.maxLength(150)],
    address:       ['', Validators.maxLength(255)],
  });

  ngOnInit(): void {
    this.providerAccountService.load().subscribe({
      next: (data) => {
        this.form.patchValue({
          phone:         data.phone ?? '',
          business_name: data.business_name ?? '',
          address:       data.address ?? '',
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Impossible de charger le profil.');
        this.isLoading.set(false);
      },
    });
  }

  onAddressInput(value: string): void {
    this.form.patchValue({ address: value });
    this.showSuggestions.set(false);

    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    if (value.length < 3) { this.suggestions.set([]); return; }

    this.debounceTimer = setTimeout(() => {
      this.http.get<any>(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(value)}&limit=5`
      ).subscribe({
        next: (res) => {
          const labels = (res.features ?? []).map((f: any) => f.properties.label as string);
          this.suggestions.set(labels);
          this.showSuggestions.set(labels.length > 0);
        },
        error: () => this.suggestions.set([]),
      });
    }, 300);
  }

  selectSuggestion(label: string): void {
    this.form.patchValue({ address: label });
    this.suggestions.set([]);
    this.showSuggestions.set(false);
  }

  hideSuggestions(): void {
    setTimeout(() => this.showSuggestions.set(false), 150);
  }

  save(): void {
    if (this.form.invalid) return;
    this.isSaving.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');

    const raw = this.form.getRawValue();
    const body: ProviderAccountUpdateDTO = {};
    if (raw.phone)         body.phone         = raw.phone;
    if (raw.business_name) body.business_name = raw.business_name;
    if (raw.address)       body.address       = raw.address;

    this.providerAccountService.update(body).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.successMessage.set('Profil mis à jour avec succès.');
      },
      error: () => {
        this.isSaving.set(false);
        this.errorMessage.set('Erreur lors de la mise à jour.');
      },
    });
  }
}
