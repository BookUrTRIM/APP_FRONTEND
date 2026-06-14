import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ClientHeader } from './client-header';
import { AuthService } from '../../../../features/auth/services/auth.service';
import { AuthApiContract } from '../../../../features/auth/services/auth.api.contract';

const mockAuthApi = { login: () => {}, signup: () => {}, verifyEmail: () => {} };

describe('ClientHeader', () => {
  let component: ClientHeader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientHeader],
      providers: [provideRouter([]), AuthService, { provide: AuthApiContract, useValue: mockAuthApi }],
    }).compileComponents();
    const fixture = TestBed.createComponent(ClientHeader);
    component = fixture.componentInstance;
  });

  it('crée le composant', () => expect(component).toBeTruthy());

  it('expose les liens de navigation', () => {
    expect(component.navItems.map(item => item.path)).toEqual([
      '/client/providers',
      '/client/appointments',
      '/client/profile',
    ]);
  });
});
