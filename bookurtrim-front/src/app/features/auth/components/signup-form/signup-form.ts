import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../enums';

@Component({
  selector: 'app-signup-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup-form.html',
  styleUrl: './signup-form.scss',
})
export class SignupFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly UserRole = UserRole;

  readonly form = this.fb.nonNullable.group({
    role:       [UserRole.CLIENT, [Validators.required]],
    first_name: ['', [Validators.required, Validators.maxLength(50)]],
    last_name:  ['', [Validators.required, Validators.maxLength(50)]],
    email:      ['', [Validators.required, Validators.email]],
    password:   ['', [Validators.required, Validators.minLength(6)]],
    phone:      [''],
  });

  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;

  get email()     { return this.form.controls.email; }
  get password()  { return this.form.controls.password; }
  get firstName() { return this.form.controls.first_name; }
  get lastName()  { return this.form.controls.last_name; }
  get currentRole(): UserRole { return this.form.controls.role.value; }

  selectRole(role: UserRole): void { this.form.patchValue({ role }); }
  togglePassword(): void { this.showPassword = !this.showPassword; }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const raw = this.form.getRawValue();
    this.authService.signup({
      email:      raw.email,
      password:   raw.password,
      role:       raw.role,
      first_name: raw.first_name,
      last_name:  raw.last_name,
      phone:      raw.phone || null,
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/auth/verify-email'], {queryParams: { state: 'check-inbox' }});
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = this._parseError(err);
      },
    });
  }

  private _parseError(err: { status: number; error?: { detail?: string } }): string {
    switch (err.status) {
      case 400:  return err.error?.detail ?? 'Données invalides.';
      case 409:  return 'Un compte existe déjà avec cet email.';
      case 422:  return 'Vérifiez que tous les champs sont correctement remplis.';
      case 0:    return 'Impossible de joindre le serveur.';
      default:   return err.error?.detail ?? 'Une erreur est survenue.';
    }
  }
}
