import { Component, inject, OnInit, signal } from '@angular/core';
import { ClientProfileService } from '../../services/client-profile.service';
import { ClientProfileFormComponent } from '../../components/client-profile-form/client-profile-form';
import type { ClientProfileUpdateDTO } from '../../dtos';

@Component({
  selector: 'app-client-profile-page',
  standalone: true,
  imports: [ClientProfileFormComponent],
  templateUrl: './client-profile-page.html',
})
export class ClientProfilePage implements OnInit {
  private readonly profileService = inject(ClientProfileService);

  readonly profile = this.profileService.profile;
  readonly isLoading = signal(false);
  readonly successMessage = signal('');
  readonly errorMessage = signal('');

  ngOnInit(): void {
    this.isLoading.set(true);
    this.profileService.loadMe().subscribe({
      next: () => this.isLoading.set(false),
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Impossible de charger votre profil.');
      },
    });
  }

  onSubmit(dto: ClientProfileUpdateDTO): void {
    this.isLoading.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');

    this.profileService.update(dto).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('Profil mis à jour avec succès.');
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Une erreur est survenue. Veuillez réessayer.');
      },
    });
  }
}
