export interface MonthlyStatModel {
  month: string;
  realizedRevenue: number;
  completedAppointments: number;
  cancelledAppointments: number;
}

export interface DashboardModel {
  bookedAppointments: number;
  completedAppointments: number;
  cancellationRate: number;
  expectedRevenue: number;
  realizedRevenue: number;
  topServiceName: string;
  averageRating: number;
  monthlyStats: MonthlyStatModel[];
}
