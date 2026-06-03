import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { AuthApiContract } from './auth.api.contract';
import { mapAuthResponseToModel } from '../mapper';
import type { LoginDTO, SignupDTO } from '../dtos';
import type { AuthModel } from '../models';
import { UserRole } from '../enums';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(AuthApiContract);
  private readonly router = inject(Router);

  private readonly _auth = signal<AuthModel | null>(this._loadFromStorage());

  readonly auth = computed(() => this._auth());
  readonly isAuthenticated = computed(() => this._auth() !== null);
  readonly currentRole = computed(() => this._auth()?.role ?? null);
  readonly isClient = computed(() => this._auth()?.role === UserRole.CLIENT);
  readonly isProvider = computed(() => this._auth()?.role === UserRole.PROVIDER);
  readonly email = computed(() => {
    const token = this._auth()?.token;
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return (payload.email ?? null) as string | null;
    } catch {
      return null;
    }
  });

  login(dto: LoginDTO): Observable<AuthModel> {
    return this.api.login(dto).pipe(
      map(responseDTO => mapAuthResponseToModel(responseDTO)),
      tap(model => {
        this._saveToStorage(model);
        this._auth.set(model);
        this._redirectByRole(model.role);
      })
    );
  }

  signup(dto: SignupDTO): Observable<void> {
    return this.api.signup(dto);
  }

  verifyEmail(token: string): Observable<{ message: string }> {
    return this.api.verifyEmail(token);
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    this._auth.set(null);
    this.router.navigate(['/auth/login']);
  }

  private _loadFromStorage(): AuthModel | null {
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('user_role') as UserRole | null;
    if (!token || !role) return null;
    return { token, role };
  }

  private _saveToStorage(model: AuthModel): void {
    localStorage.setItem('access_token', model.token);
    localStorage.setItem('user_role', model.role);
  }

  private _redirectByRole(role: UserRole): void {
    this.router.navigate([role === UserRole.PROVIDER ? '/pro' : '/client']);
  }
}
