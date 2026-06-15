import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ProviderDetailService } from '../../services/provider-detail.service';
import { getProviderFullName, getProviderInitials } from '../../mapper';
import { AppHeader } from '../../../../shared/components/app-header/app-header';

@Component({
  selector: 'app-provider-detail-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, AppHeader],
  providers: [ProviderDetailService],
  templateUrl: './provider-detail-layout.html',
})
export class ProviderDetailLayout implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly providerDetail = inject(ProviderDetailService);

  readonly provider = this.providerDetail.provider;
  readonly isLoading = this.providerDetail.isLoading;
  readonly errorMessage = this.providerDetail.errorMessage;

  readonly getFullName = getProviderFullName;
  readonly getInitials = getProviderInitials;

  get providerId(): number {
    return Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.providerDetail.load(this.providerId);
  }

  goBack(): void {
    this.router.navigate(['/providers']);
  }
}
