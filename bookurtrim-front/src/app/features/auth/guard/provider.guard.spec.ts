import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { providerGuard } from './provider.guard';
import { AuthService } from '../services/auth.service';
import { AuthApiContract } from '../services/auth.api.contract';

const mockAuthApi = { login: () => {}, signup: () => {} };

describe('providerGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        AuthService,
        { provide: AuthApiContract, useValue: mockAuthApi },
      ],
    });
    localStorage.clear();
  });

  afterEach(() => localStorage.clear());

  it('autorise si role est provider', () => {
    localStorage.setItem('access_token', 'token');
    localStorage.setItem('user_role', 'provider');
    const result = TestBed.runInInjectionContext(() => providerGuard({} as any, {} as any));
    expect(result).toBe(true);
  });

  it('redirige vers /client si connecté mais pas provider', () => {
    localStorage.setItem('access_token', 'token');
    localStorage.setItem('user_role', 'client');
    const result = TestBed.runInInjectionContext(() => providerGuard({} as any, {} as any));
    expect(result).not.toBe(true);
  });

  it('redirige vers /auth/login si non connecté', () => {
    const result = TestBed.runInInjectionContext(() => providerGuard({} as any, {} as any));
    expect(result).not.toBe(true);
  });
});
