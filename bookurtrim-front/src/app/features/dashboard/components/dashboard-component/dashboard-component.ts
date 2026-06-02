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
  public availableYears: string[] = [];
  public currentPeriod = 'month';

  constructor() {
    this.generateYears();
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
    this.dashboardService.loadDashboard(this.currentPeriod);
  }

  onPeriodChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.currentPeriod = selectElement.value;
    this.dashboardService.loadDashboard(this.currentPeriod);
  }

  private generateYears() {
    const startYear = 2026;
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 1; i >= startYear; i--) {
      this.availableYears.push(i.toString());
    }
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
            label: "Annulations",
            data: data.monthly_stats.map((m: any) => m.cancelled_appointments),
            backgroundColor: '#f43f5e',
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }
}
