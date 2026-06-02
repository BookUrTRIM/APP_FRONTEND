import { Component, ElementRef, viewChild, effect, input } from '@angular/core';
import { MonthlyStatModel } from '../../models/dashboard.model';
import {Chart, registerables} from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-revenue-chart',
  standalone: true,
  templateUrl: './revenue-chart.html'
})
export class RevenueChartComponent {
  stats = input.required<MonthlyStatModel[]>();
  chartRef = viewChild<ElementRef>('revenueChart');
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
      type: 'line',
      data: {
        labels: data.map(m => m.month),
        datasets: [{
          label: 'CA réalisé (€)',
          data: data.map(m => m.realizedRevenue),
          borderColor: '#4f46e5',
          backgroundColor: 'rgba(79, 70, 229, 0.04)',
          fill: true,
          tension: 0.35
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });
  }
}
