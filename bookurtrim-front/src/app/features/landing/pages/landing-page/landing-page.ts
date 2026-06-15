import { Component } from '@angular/core';
import { LandingNavbar } from '../../components/landing-navbar/landing-navbar';
import { LandingHero } from '../../components/landing-hero/landing-hero';
import { LandingFeatures } from '../../components/landing-features/landing-features';
import { LandingCta } from '../../components/landing-cta/landing-cta';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [LandingNavbar, LandingHero, LandingFeatures, LandingCta],
  templateUrl: './landing-page.html',
})
export class LandingPage {}
