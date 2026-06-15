import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal';
import { ProviderSidebar } from '../../components/provider-sidebar/provider-sidebar';
import { ProviderTopbar } from '../../components/provider-topbar/provider-topbar';
import { ProviderBottomNav } from '../../components/provider-bottom-nav/provider-bottom-nav';
import { ProviderAccountService } from '../../../../features/provider/services/provider-account.service';

@Component({
  selector: 'app-provider-layout',
  standalone: true,
  imports: [RouterOutlet, ConfirmModalComponent, ProviderSidebar, ProviderTopbar, ProviderBottomNav],
  templateUrl: './provider-layout.html',
})
export class ProviderLayout implements OnInit {
  private readonly providerAccountService = inject(ProviderAccountService);

  readonly provider = this.providerAccountService.provider;

  ngOnInit(): void {
    this.providerAccountService.load().subscribe();
  }
}
