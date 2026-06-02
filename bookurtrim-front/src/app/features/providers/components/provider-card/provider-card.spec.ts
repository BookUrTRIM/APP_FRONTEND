import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProviderCardComponent } from './provider-card';
import { getProviderFullName, getProviderInitials } from '../../mapper';
import type { ProviderModel } from '../../models';

const makeProvider = (overrides: Partial<ProviderModel> = {}): ProviderModel => ({
  id: 1, userAccountId: 2,
  firstName: 'Marie', lastName: 'Dubois',
  phone: '06 12 34 56 78',
  businessName: 'Salon Marie', address: '12 rue de la Paix',
  stripeAccountId: null,
  createdAt: '', updatedAt: '',
  ...overrides,
});

describe('ProviderCardComponent — logique', () => {
  let component: ProviderCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderCardComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(ProviderCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('provider', makeProvider());
  });

  it('crée le composant', () => expect(component).toBeTruthy());

  it('getFullName retourne prénom + nom', () => {
    expect(getProviderFullName(makeProvider())).toBe('Marie Dubois');
  });

  it('getInitials retourne les initiales', () => {
    expect(getProviderInitials(makeProvider())).toBe('MD');
  });

  it('getFullName fonctionne avec d\'autres noms', () => {
    expect(getProviderFullName(makeProvider({ firstName: 'Jean', lastName: 'Dupont' }))).toBe('Jean Dupont');
  });

  it('provider() retourne le provider passé en input', () => {
    expect(component.provider().id).toBe(1);
    expect(component.provider().firstName).toBe('Marie');
  });
});
