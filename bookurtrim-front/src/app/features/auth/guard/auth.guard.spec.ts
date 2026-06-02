import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { AuthApiContract } from '../services/auth.api.contract';

const mockAuthApi = { login: () => {}, signup: () => {} };

describe('authGuard', () => {
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        AuthService,
        { provide: AuthApiContract, useValue: mockAuthApi },
      ],
    });
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('autorise si authentifié', () => {
    localStorage.setItem('access_token', 'token123');
    localStorage.setItem('user_role', 'client');
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).toBeTruthy();
    localStorage.clear();
  });

  it('redirige vers login si non authentifié', () => {
    localStorage.clear();
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).not.toBe(true);
  });
});
