import { Component, inject, OnInit } from '@angular/core';
import {CurrencyPipe, DecimalPipe} from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import {KpiCardComponent} from '../../components/kpi-card/kpi-card';
import {StatsChartComponent} from '../../components/stats-chart/stats-chart';
import {RevenueChartComponent} from '../../components/revenue-chart/revenue-chart';


@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [DecimalPipe, KpiCardComponent, StatsChartComponent, RevenueChartComponent, CurrencyPipe],
  templateUrl: './dashboard-page.html'
})
export class DashboardPageComponent implements OnInit {
  public dashboardService = inject(DashboardService);

  public availableYears: string[] = [];
  public currentPeriod = 'month';

  ngOnInit() {
    this.generateYears();
    this.dashboardService.loadDashboard(this.currentPeriod);
  }

  onPeriodChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.currentPeriod = selectElement.value;
    this.dashboardService.loadDashboard(this.currentPeriod);
  }

  private generateYears() {
    const startYear = 2024;
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 1; i >= startYear; i--) {
      this.availableYears.push(i.toString());
    }
  }
}
