import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LandingFeatures } from './landing-features';

describe('LandingFeatures', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingFeatures],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('devrait créer le composant', () => {
    const fixture = TestBed.createComponent(LandingFeatures);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
