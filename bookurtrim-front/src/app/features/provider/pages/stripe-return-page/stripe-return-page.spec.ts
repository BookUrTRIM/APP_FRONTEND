import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { StripeReturnPage } from './stripe-return-page';

describe('StripeReturnPage', () => {
  function createWithMode(mode: 'return' | 'refresh') {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [StripeReturnPage],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { data: { mode } } } },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(StripeReturnPage);
    fixture.componentInstance;
    return fixture.componentInstance;
  }

  it('mode est return par défaut', () => {
    const component = createWithMode('return');
    expect(component.mode).toBe('return');
  });

  it('mode est refresh quand passé en data', () => {
    const component = createWithMode('refresh');
    expect(component.mode).toBe('refresh');
  });
});
