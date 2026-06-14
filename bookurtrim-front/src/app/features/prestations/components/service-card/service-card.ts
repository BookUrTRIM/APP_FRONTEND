import { Component, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { formatDuration } from '../../mapper';
import type { ServiceModel } from '../../models';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './service-card.html',
})
export class ServiceCardComponent {
  readonly service = input.required<ServiceModel>();
  readonly onEdit = output<ServiceModel>();
  readonly onDelete = output<number>();

  readonly formatDuration = formatDuration;
}
