import { Component, ElementRef, inject, OnInit, ViewChild, effect } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe, DecimalPipe],
  templateUrl: './dashboard-component.html'
})
export class DashboardComponent implements OnInit {
  public dashboardService = inject(DashboardService);

  @ViewChild('revenueChart') revenueChartRef!: ElementRef;
  @ViewChild('statsChart') statsChartRef!: ElementRef;

  private revChartInstance: any;
  private statsChartInstance: any;

  constructor() {
    effect(() => {
      const data = this.dashboardService.dashboardData();
      if (data) {
        setTimeout(() => {
          if (this.revenueChartRef && this.statsChartRef) {
            this.renderCharts(data);
          }
        }, 50);
      }
    });
  }

  ngOnInit() {
    this.dashboardService.loadDashboard();
  }

  private renderCharts(data: any) {
    if (this.revChartInstance) this.revChartInstance.destroy();
    if (this.statsChartInstance) this.statsChartInstance.destroy();
    const labels = data.monthly_stats.map((m: any) => m.month);
    this.revChartInstance = new Chart(this.revenueChartRef.nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'CA Réalisé (€)',
          data: data.monthly_stats.map((m: any) => m.realized_revenue),
          borderColor: '#4f46e5',
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        }
      }
    });
    this.statsChartInstance = new Chart(this.statsChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Prestations terminées',
            data: data.monthly_stats.map((m: any) => m.completed_appointments),
            backgroundColor: '#10b981',
            borderRadius: 6
          },
          {
            label: "Taux d'annulation (%)",
            data: data.monthly_stats.map((m: any) => m.cancellation_rate),
            backgroundColor: '#f43f5e',
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
}
