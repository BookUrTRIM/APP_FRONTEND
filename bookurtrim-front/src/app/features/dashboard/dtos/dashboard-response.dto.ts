export interface MonthlyStatDTO {
  month: string;
  realized_revenue: number;
  completed_appointments: number;
  cancelled_appointments: number;
}

export interface DashboardResponseDTO {
  booked_appointments: number;
  completed_appointments: number;
  cancellation_rate: number;
  expected_revenue: number;
  realized_revenue: number;
  top_service_name: string;
  average_rating: number;
  monthly_stats: MonthlyStatDTO[];
}
