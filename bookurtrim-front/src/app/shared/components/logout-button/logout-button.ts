import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';

export type LogoutButtonTheme = 'cream' | 'taupe' | 'sidebar';

const LOGOUT_ICON_PATH =
  'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1';
const LOGIN_ICON_PATH =
  'M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1';

@Component({
  selector: 'app-logout-button',
  standalone: true,
  templateUrl: './logout-button.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutButtonComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly theme = input<LogoutButtonTheme>('cream');
  readonly iconOnly = input(false);

  readonly isLoggedIn = this.authService.isAuthenticated;

  private readonly isExpanded = computed(
    () => this.theme() === 'sidebar' || (this.theme() === 'cream' && !this.iconOnly())
  );

  readonly showLabel = this.isExpanded;
  readonly iconClass = computed(() => (this.isExpanded() ? 'w-4 h-4' : 'w-5 h-5'));
  readonly iconPath = computed(() => (this.isLoggedIn() ? LOGOUT_ICON_PATH : LOGIN_ICON_PATH));
  readonly label = computed(() => (this.isLoggedIn() ? 'Déconnexion' : 'Se connecter'));

  readonly buttonClass = computed(() => {
    const theme = this.theme();
    if (theme === 'sidebar') {
      return 'w-full flex items-center justify-center gap-2 px-4 py-2 hover:bg-cream/10 text-cream/50 hover:text-cream rounded-xl transition-colors text-sm';
    }
    if (theme === 'taupe') {
      return 'md:hidden p-2 text-taupe hover:text-espresso transition-colors';
    }
    return this.iconOnly()
      ? 'md:hidden p-2 text-cream/40 hover:text-cream/80 transition-colors'
      : 'hidden md:inline-flex items-center gap-1.5 text-cream/40 hover:text-cream/80 px-3 py-2 rounded-full text-sm font-medium transition-colors';
  });

  onClick(): void {
    if (this.isLoggedIn()) {
      this.authService.logout();
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}
