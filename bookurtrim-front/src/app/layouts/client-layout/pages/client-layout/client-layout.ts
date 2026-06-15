import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal';
import { ClientHeader } from '../../components/client-header/client-header';
import { ClientBottomNav } from '../../components/client-bottom-nav/client-bottom-nav';

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [RouterOutlet, ConfirmModalComponent, ClientHeader, ClientBottomNav],
  templateUrl: './client-layout.html',
})
export class ClientLayout {}
