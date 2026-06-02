import { TestBed } from '@angular/core/testing';
import { ServiceCardComponent } from './service-card';
import { formatDuration } from '../../mapper';
import type { ServiceModel } from '../../models';

const makeService = (overrides: Partial<ServiceModel> = {}): ServiceModel => ({
  id: 1, providerId: 1, name: 'Coupe homme',
  description: 'Coupe classique', basePrice: 25, defaultDuration: 30,
  createdAt: '', updatedAt: '',
  ...overrides,
});

describe('ServiceCardComponent — logique', () => {
  let component: ServiceCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceCardComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(ServiceCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('service', makeService());
  });

  it('crée le composant', () => expect(component).toBeTruthy());

  it('service() retourne le service passé en input', () => {
    expect(component.service().name).toBe('Coupe homme');
    expect(component.service().basePrice).toBe(25);
  });

  it('émet onEdit avec le service complet', () => {
    let emitted: ServiceModel | null = null;
    component.onEdit.subscribe((s: ServiceModel) => emitted = s);
    component.onEdit.emit(makeService());
    expect(emitted!.id).toBe(1);
  });

  it('émet onDelete avec l\'id du service', () => {
    let emittedId: number | null = null;
    component.onDelete.subscribe((id: number) => emittedId = id);
    component.onDelete.emit(1);
    expect(emittedId).toBe(1);
  });

  it('formatDuration formate correctement', () => {
    expect(formatDuration(30)).toBe('30 min');
    expect(formatDuration(60)).toBe('1h');
    expect(formatDuration(90)).toBe('1h 30min');
  });
});
