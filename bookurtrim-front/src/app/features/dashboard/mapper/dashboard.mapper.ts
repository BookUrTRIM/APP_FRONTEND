import { DashboardResponseDTO } from '../dtos/dashboard-response.dto';
import { DashboardModel } from '../models/dashboard.model';

export function mapDashboardDTOToModel(dto: DashboardResponseDTO): DashboardModel {
  return {
    bookedAppointments: dto.booked_appointments,
    completedAppointments: dto.completed_appointments,
    cancellationRate: dto.cancellation_rate,
    expectedRevenue: dto.expected_revenue,
    realizedRevenue: dto.realized_revenue,
    topServiceName: dto.top_service_name,
    averageRating: dto.average_rating,
    monthlyStats: dto.monthly_stats.map(m => ({
      month: m.month,
      realizedRevenue: m.realized_revenue,
      completedAppointments: m.completed_appointments,
      cancelledAppointments: m.cancelled_appointments
    }))
  };
}
