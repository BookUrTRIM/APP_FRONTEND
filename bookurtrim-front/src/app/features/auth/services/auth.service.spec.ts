import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from './auth.service';
import { AuthApiContract } from './auth.api.contract';
import { UserRole } from '../enums';

const mockAuthApi = { login: () => {}, signup: () => {} };

function makeJwt(payload: object): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body   = btoa(JSON.stringify(payload));
  return `${header}.${body}.signature`;
}

function createService(): AuthService {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      AuthService,
      { provide: AuthApiContract, useValue: mockAuthApi },
    ],
  });
  return TestBed.inject(AuthService);
}

describe('AuthService', () => {
  afterEach(() => localStorage.clear());

  describe('isAuthenticated', () => {
    it('retourne false si pas de token', () => {
      localStorage.clear();
      const service = createService();
      expect(service.isAuthenticated()).toBe(false);
    });

    it('retourne true si token présent', () => {
      localStorage.setItem('access_token', 'token123');
      localStorage.setItem('user_role', UserRole.CLIENT);
      const service = createService();
      expect(service.isAuthenticated()).toBe(true);
    });
  });

  describe('isClient / isProvider', () => {
    it('isClient retourne true pour role client', () => {
      localStorage.setItem('access_token', 'token');
      localStorage.setItem('user_role', UserRole.CLIENT);
      const service = createService();
      expect(service.isClient()).toBe(true);
      expect(service.isProvider()).toBe(false);
    });

    it('isProvider retourne true pour role provider', () => {
      localStorage.setItem('access_token', 'token');
      localStorage.setItem('user_role', UserRole.PROVIDER);
      const service = createService();
      expect(service.isProvider()).toBe(true);
      expect(service.isClient()).toBe(false);
    });
  });

  describe('email', () => {
    it('retourne null si pas de token', () => {
      localStorage.clear();
      const service = createService();
      expect(service.email()).toBeNull();
    });

    it('extrait l\'email du payload JWT', () => {
      const token = makeJwt({ sub: '1', email: 'test@example.com', role: 'client' });
      localStorage.setItem('access_token', token);
      localStorage.setItem('user_role', UserRole.CLIENT);
      const service = createService();
      expect(service.email()).toBe('test@example.com');
    });

    it('retourne null si email absent du JWT', () => {
      const token = makeJwt({ sub: '1', role: 'client' });
      localStorage.setItem('access_token', token);
      localStorage.setItem('user_role', UserRole.CLIENT);
      const service = createService();
      expect(service.email()).toBeNull();
    });
  });

  describe('logout', () => {
    it('vide le localStorage et remet auth à null', () => {
      localStorage.setItem('access_token', 'token');
      localStorage.setItem('user_role', UserRole.CLIENT);
      const service = createService();
      service.logout();
      expect(localStorage.getItem('access_token')).toBeNull();
      expect(service.isAuthenticated()).toBe(false);
    });
  });
});
