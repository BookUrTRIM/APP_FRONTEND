import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppHeader } from './app-header';
import { AuthService } from '../../../features/auth/services/auth.service';
import { AuthApiContract } from '../../../features/auth/services/auth.api.contract';

const mockAuthApi = { login: () => {}, signup: () => {}, verifyEmail: () => {} };

describe('AppHeader', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppHeader],
      providers: [provideRouter([]), AuthService, { provide: AuthApiContract, useValue: mockAuthApi }],
    }).compileComponents();
  });

  it('crée le composant', () => {
    const fixture = TestBed.createComponent(AppHeader);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('affiche le header public (non connecté) par défaut', () => {
    const fixture = TestBed.createComponent(AppHeader);
    fixture.detectChanges();
    expect(fixture.componentInstance.isClient()).toBe(false);
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Se connecter');
  });
});
