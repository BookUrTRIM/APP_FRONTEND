import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { clientGuard } from './client.guard';
import { AuthService } from '../services/auth.service';
import { AuthApiContract } from '../services/auth.api.contract';
import { UserRole } from '../enums';

const mockAuthApi = { login: () => {}, signup: () => {} };

describe('clientGuard', () => {
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

  it('autorise si role est client', () => {
    localStorage.setItem('access_token', 'token');
    localStorage.setItem('user_role', UserRole.CLIENT);
    const result = TestBed.runInInjectionContext(() => clientGuard({} as any, {} as any));
    expect(result).toBe(true);
  });

  it('redirige vers /pro si connecté mais pas client', () => {
    localStorage.setItem('access_token', 'token');
    localStorage.setItem('user_role', UserRole.PROVIDER);
    const result = TestBed.runInInjectionContext(() => clientGuard({} as any, {} as any));
    expect(result).not.toBe(true);
  });

  it('redirige vers /auth/login si non connecté', () => {
    const result = TestBed.runInInjectionContext(() => clientGuard({} as any, {} as any));
    expect(result).not.toBe(true);
  });
});
