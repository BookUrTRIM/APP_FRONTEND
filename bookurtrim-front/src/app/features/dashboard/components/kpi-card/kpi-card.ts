import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [NgClass],
  templateUrl: './kpi-card.html'
})
export class KpiCardComponent {
  title = input.required<string>();
  value = input.required<string | number | null>();
  subtext = input<string>('');
  variant = input<'emerald' | 'indigo' | 'slate'>('slate');
  icon = input<string>('');
}
