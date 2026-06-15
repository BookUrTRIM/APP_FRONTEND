import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LandingNavbar } from './landing-navbar';

describe('LandingNavbar', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingNavbar],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('devrait créer le composant', () => {
    const fixture = TestBed.createComponent(LandingNavbar);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
