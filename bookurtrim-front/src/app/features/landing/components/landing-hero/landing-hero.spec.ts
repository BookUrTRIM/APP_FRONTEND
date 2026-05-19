import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LandingHero } from './landing-hero';

describe('LandingHero', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingHero],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('devrait créer le composant', () => {
    const fixture = TestBed.createComponent(LandingHero);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
