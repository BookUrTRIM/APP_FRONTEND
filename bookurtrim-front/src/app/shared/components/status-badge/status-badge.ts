import { Component, input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.scss',
})
export class StatusBadgeComponent {
  readonly label = input.required<string>();
  readonly colorClass = input.required<string>();
}
