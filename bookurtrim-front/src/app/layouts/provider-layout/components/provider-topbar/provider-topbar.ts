import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LogoutButtonComponent } from '../../../../shared/components/logout-button/logout-button';
import type { ProviderAccountModel } from '../../../../features/provider/models';

@Component({
  selector: 'app-provider-topbar',
  standalone: true,
  imports: [LogoutButtonComponent],
  templateUrl: './provider-topbar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProviderTopbar {
  readonly provider = input<ProviderAccountModel | null>(null);

  readonly initials = computed(() => {
    const p = this.provider();
    if (!p) return '?';
    return `${p.first_name[0]}${p.last_name[0]}`.toUpperCase();
  });

  readonly fullName = computed(() => {
    const p = this.provider();
    if (!p) return '';
    return `${p.first_name} ${p.last_name}`;
  });
}
