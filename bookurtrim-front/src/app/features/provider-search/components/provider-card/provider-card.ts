import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { getProviderFullName, getProviderInitials } from '../../mapper';
import type { ProviderModel } from '../../models';

@Component({
  selector: 'app-provider-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './provider-card.html',
})
export class ProviderCardComponent {
  readonly provider = input.required<ProviderModel>();

  readonly getFullName = getProviderFullName;
  readonly getInitials = getProviderInitials;
}
