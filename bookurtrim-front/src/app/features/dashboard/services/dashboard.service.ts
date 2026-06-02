import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {DashboardResponseDTO} from '../models/dashboard.models';


@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);
  public dashboardData = signal<DashboardResponseDTO | null>(null);
  public isLoading = signal<boolean>(false);

  loadDashboard(): void {
    this.isLoading.set(true);
    this.http.get<DashboardResponseDTO>('/dashboard/provider').subscribe({
      next: (data) => {
        this.dashboardData.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }
}
