import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LandingCta } from './landing-cta';

describe('LandingCta', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingCta],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('devrait créer le composant', () => {
    const fixture = TestBed.createComponent(LandingCta);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
