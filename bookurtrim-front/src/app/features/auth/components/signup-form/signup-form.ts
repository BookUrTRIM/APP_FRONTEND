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
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: [UserRole.CLIENT, [Validators.required]],
  });

  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;

  get email() { return this.form.controls.email; }
  get password() { return this.form.controls.password; }
  get currentRole(): UserRole { return this.form.controls.role.value; }

  selectRole(role: UserRole): void {
    this.form.patchValue({ role });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.signup(this.form.getRawValue()).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Compte créé avec succès ! Redirection vers la connexion...';
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = this._parseError(err);
      },
    });
  }

  private _parseError(err: { status: number; error?: { detail?: string } }): string {
    switch (err.status) {
      case 400:
        return err.error?.detail ?? 'Données invalides.';
      case 409:
        return 'Un compte existe déjà avec cet email.';
      case 422:
        return 'Vérifiez que tous les champs sont correctement remplis.';
      case 0:
        return 'Impossible de joindre le serveur. Vérifiez votre connexion.';
      default:
        return err.error?.detail ?? 'Une erreur est survenue. Veuillez réessayer.';
    }
  }
}
