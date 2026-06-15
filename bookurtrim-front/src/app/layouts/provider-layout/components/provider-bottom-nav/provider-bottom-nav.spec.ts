import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProviderBottomNav } from './provider-bottom-nav';

describe('ProviderBottomNav', () => {
  let component: ProviderBottomNav;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderBottomNav],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(ProviderBottomNav);
    component = fixture.componentInstance;
  });

  it('crée le composant', () => expect(component).toBeTruthy());

  it('expose les liens de navigation mobile', () => {
    expect(component.navItems.map(item => item.path)).toEqual([
      '/pro/appointments',
      '/pro/planning',
      '/pro/services',
      '/pro/profile',
      '/pro/stripe-connect',
    ]);
  });
});
