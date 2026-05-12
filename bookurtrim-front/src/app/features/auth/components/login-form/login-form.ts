import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  isLoading = false;
  errorMessage = '';
  showPassword = false;

  get email() { return this.form.controls.email; }
  get password() { return this.form.controls.password; }

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

    this.authService.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = this._parseError(err);
      },
    });
  }

  private _parseError(err: { status: number; error?: { detail?: string } }): string {
    switch (err.status) {
      case 401:
        return 'Email ou mot de passe incorrect.';
      case 422:
        return 'Données invalides. Vérifiez votre email et mot de passe.';
      case 0:
        return 'Impossible de joindre le serveur. Vérifiez votre connexion.';
      default:
        return err.error?.detail ?? 'Une erreur est survenue. Veuillez réessayer.';
    }
  }
}
