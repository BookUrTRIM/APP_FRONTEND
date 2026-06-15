import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ClientBottomNav } from './client-bottom-nav';

describe('ClientBottomNav', () => {
  let component: ClientBottomNav;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientBottomNav],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(ClientBottomNav);
    component = fixture.componentInstance;
  });

  it('crée le composant', () => expect(component).toBeTruthy());

  it('expose les liens de navigation mobile', () => {
    expect(component.navItems.map(item => item.path)).toEqual([
      '/providers',
      '/client/appointments',
      '/client/profile',
    ]);
  });
});
