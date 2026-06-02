import { Component, ElementRef, viewChild, effect, input } from '@angular/core';
import { MonthlyStatModel } from '../../models/dashboard.model';
import {Chart, registerables} from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-stats-chart',
  standalone: true,
  templateUrl: './stats-chart.html'
})
export class StatsChartComponent {
  stats = input.required<MonthlyStatModel[]>();
  chartRef = viewChild<ElementRef>('statsChart'); // Même correction ici
  private chartInstance: any;

  constructor() {
    effect(() => {
      const data = this.stats();
      const canvasEl = this.chartRef();

      if (data && canvasEl) {
        setTimeout(() => this.renderChart(data, canvasEl), 0);
      }
    });
  }

  private renderChart(data: MonthlyStatModel[], canvas: ElementRef) {
    if (this.chartInstance) this.chartInstance.destroy();

    this.chartInstance = new Chart(canvas.nativeElement, {
      type: 'bar',
      data: {
        labels: data.map(m => m.month),
        datasets: [
          {
            label: 'Prestations terminées',
            data: data.map(m => m.completedAppointments),
            backgroundColor: '#10b981',
            borderRadius: 4
          },
          {
            label: 'Annulations',
            data: data.map(m => m.cancelledAppointments),
            backgroundColor: '#f43f5e',
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
      }
    });
  }
}
