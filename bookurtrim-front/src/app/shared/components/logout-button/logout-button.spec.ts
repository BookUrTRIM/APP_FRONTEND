import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { LogoutButtonComponent } from './logout-button';
import { AuthService } from '../../../features/auth/services/auth.service';
import { AuthApiContract } from '../../../features/auth/services/auth.api.contract';

const mockAuthApi = { login: () => {}, signup: () => {}, verifyEmail: () => {} };

describe('LogoutButtonComponent', () => {
  let component: LogoutButtonComponent;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [LogoutButtonComponent],
      providers: [provideRouter([]), AuthService, { provide: AuthApiContract, useValue: mockAuthApi }],
    }).compileComponents();
    const fixture = TestBed.createComponent(LogoutButtonComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => localStorage.clear());

  it('crée le composant', () => expect(component).toBeTruthy());

  it('thème cream affiche le label seulement en mode étendu', () => {
    expect(component.showLabel()).toBe(true);
    expect(component.iconClass()).toBe('w-4 h-4');
  });

  it('thème cream en iconOnly masque le label', () => {
    const fixture = TestBed.createComponent(LogoutButtonComponent);
    fixture.componentRef.setInput('iconOnly', true);
    const comp = fixture.componentInstance;
    expect(comp.showLabel()).toBe(false);
    expect(comp.iconClass()).toBe('w-5 h-5');
  });

  it('thème sidebar affiche toujours le label', () => {
    const fixture = TestBed.createComponent(LogoutButtonComponent);
    fixture.componentRef.setInput('theme', 'sidebar');
    const comp = fixture.componentInstance;
    expect(comp.showLabel()).toBe(true);
    expect(comp.iconClass()).toBe('w-4 h-4');
  });

  it('thème taupe masque toujours le label', () => {
    const fixture = TestBed.createComponent(LogoutButtonComponent);
    fixture.componentRef.setInput('theme', 'taupe');
    const comp = fixture.componentInstance;
    expect(comp.showLabel()).toBe(false);
    expect(comp.iconClass()).toBe('w-5 h-5');
  });

  it('utilisateur non connecté : propose "Se connecter" et redirige vers /auth/login', () => {
    expect(component.isLoggedIn()).toBe(false);
    expect(component.label()).toBe('Se connecter');

    const router = TestBed.inject(Router);
    const spy = vi.spyOn(router, 'navigate');
    component.onClick();
    expect(spy).toHaveBeenCalledWith(['/auth/login']);
  });

  it('utilisateur connecté : propose "Déconnexion" et délègue à AuthService.logout()', () => {
    TestBed.resetTestingModule();
    localStorage.setItem('access_token', 'token123');
    localStorage.setItem('user_role', 'client');
    TestBed.configureTestingModule({
      imports: [LogoutButtonComponent],
      providers: [provideRouter([]), AuthService, { provide: AuthApiContract, useValue: mockAuthApi }],
    });

    const fixture = TestBed.createComponent(LogoutButtonComponent);
    const comp = fixture.componentInstance;
    expect(comp.isLoggedIn()).toBe(true);
    expect(comp.label()).toBe('Déconnexion');

    const authService = TestBed.inject(AuthService);
    const spy = vi.spyOn(authService, 'logout');
    comp.onClick();
    expect(spy).toHaveBeenCalled();
  });
});
