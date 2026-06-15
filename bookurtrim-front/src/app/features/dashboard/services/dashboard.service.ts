import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DashboardResponseDTO } from '../dtos/dashboard-response.dto';
import { DashboardModel } from '../models/dashboard.model';
import { mapDashboardDTOToModel } from '../mapper/dashboard.mapper';


@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);

  public dashboardData = signal<DashboardModel | null>(null);
  public isLoading = signal<boolean>(false);

  loadDashboard(period: string = 'month'): void {
    this.isLoading.set(true);
    this.http.get<DashboardResponseDTO>(`/dashboard/provider?period=${period}`).subscribe({
      next: (dto) => {
        this.dashboardData.set(mapDashboardDTOToModel(dto));
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }
}
