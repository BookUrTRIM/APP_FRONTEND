import { Component, inject, OnInit } from '@angular/core';
import { AvailabilityService } from '../../services/availability.service';

import { PlanningFormComponent } from '../../components/planning-form/planning-form';
import { PlanningListComponent } from '../../components/planning-list/planning-list';
import {
  AvailabilityCreateDTO,
  AvailabilityResponseDTO,
  PlanningFormValue
} from '../../../../core/models/availability.models';
import {AvailabilityMapper} from '../../../../core/mappers/availabilty.mapper';
import {PlanningCalendarComponent} from '../../components/planning-calendar/planning-calendar';

@Component({
  selector: 'app-planning-page',
  standalone: true,
  imports: [PlanningFormComponent, PlanningListComponent,PlanningCalendarComponent],
  templateUrl: './planning-page.html'
})
export class PlanningPage implements OnInit {
  private availabilityService = inject(AvailabilityService);

  // TODO: Récupérer l'ID dynamiquement via le profil utilisateur connecté
  private currentProviderId = 1;
  viewMode: 'list' | 'calendar' = 'calendar';
  availabilities: AvailabilityResponseDTO[] = [];
  isLoading = false;
  currentPage = 1;

  ngOnInit(): void {
    this.loadAvailabilities();
  }

  loadAvailabilities(): void {
    this.availabilityService.getAvailabilities(this.currentProviderId).subscribe({
      next: (data) => {
        this.availabilities = data;
      },
      error: (err) => console.error('Erreur chargement plannings', err)
    });
  }

  handleFormSubmit(formValue: PlanningFormValue): void {
    const all = AvailabilityMapper.toBulkCreateDTOs(formValue);
    const dtos = all.filter(dto => !this.availabilities.some(
      a => a.day_date === dto.day_date &&
           a.start_time === dto.start_time &&
           a.end_time === dto.end_time &&
           a.slot_type === dto.slot_type
    ));
    if (dtos.length === 0) return;
    this.executeBulkRequest(dtos);
  }

  handleAbsenceSubmit(date: string): void {
    const dtos = AvailabilityMapper.toAbsenceDTO(date);
    this.executeBulkRequest(dtos);
  }

  private executeBulkRequest(dtos: AvailabilityCreateDTO[]): void {
    this.isLoading = true;
    this.availabilityService.createBulkAvailabilities(dtos).subscribe({
      next: () => {
        this.isLoading = false;
        this.currentPage = 1;
        this.loadAvailabilities();
      },
      error: (err) => {
        console.error('Erreur lors de l\'enregistrement Bulk', err);
        this.isLoading = false;
      }
    });
  }

  handleDelete(id: number): void {
    this.availabilityService.deleteAvailability(id).subscribe({
      next: () => this.loadAvailabilities()
    });
  }

  handlePageChange(newPage: number): void {
    this.currentPage = newPage;
  }
}
