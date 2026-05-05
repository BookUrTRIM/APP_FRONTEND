import { Component } from '@angular/core';
import {LandingNavbar} from '../landing-navbar/landing-navbar';
import {LandingHero} from '../landing-hero/landing-hero';
import {LandingFeatures} from '../landing-features/landing-features';
import {LandingCta} from '../landing-cta/landing-cta';
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    LandingNavbar,
    LandingHero,
    LandingFeatures,
    LandingCta
  ],
  templateUrl: './landing.html',
})
export class Landing { }
