import { TestBed } from '@angular/core/testing';
import { StatusBadgeComponent } from './status-badge';

describe('StatusBadgeComponent', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<StatusBadgeComponent>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusBadgeComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(StatusBadgeComponent);
    fixture.componentRef.setInput('label', 'Confirmé');
    fixture.componentRef.setInput('colorClass', 'bg-green-100 text-green-700');
    fixture.detectChanges();
  });

  it('crée le composant', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('affiche le label', () => {
    const span: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(span.textContent?.trim()).toBe('Confirmé');
  });

  it('applique la classe de couleur fournie', () => {
    const span: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(span.classList.contains('bg-green-100')).toBe(true);
    expect(span.classList.contains('text-green-700')).toBe(true);
  });
});
