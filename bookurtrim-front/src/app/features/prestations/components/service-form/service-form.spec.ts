import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceFormComponent } from './service-form';

describe('ServiceFormComponent', () => {
  let component: ServiceFormComponent;
  let fixture: ComponentFixture<ServiceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceFormComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ServiceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('crée le composant', () => expect(component).toBeTruthy());

  it('le formulaire est invalide à vide', () => {
    expect(component.form.invalid).toBe(true);
  });

  it('le formulaire devient valide avec nom et prix', () => {
    component.form.patchValue({ name: 'Coupe', base_price: 20 });
    expect(component.form.valid).toBe(true);
  });

  it('le champ name est requis', () => {
    component.form.patchValue({ name: '' });
    expect(component.name.hasError('required')).toBe(true);
  });

  it('le champ name a une limite de 100 caractères', () => {
    component.form.patchValue({ name: 'a'.repeat(101) });
    expect(component.name.hasError('maxlength')).toBe(true);
  });

  it('base_price ne peut pas être négatif', () => {
    component.form.patchValue({ base_price: -1 });
    expect(component.basePrice.hasError('min')).toBe(true);
  });

  it('default_duration ne peut pas être 0', () => {
    component.form.patchValue({ default_duration: 0 });
    expect(component.defaultDuration.hasError('min')).toBe(true);
  });

  it('isEdit retourne false par défaut', () => {
    expect(component.isEdit).toBe(false);
  });

  it('isEdit retourne true si un service est passé', () => {
    fixture.componentRef.setInput('service', {
      id: 1, providerId: 1, name: 'Test', description: null,
      basePrice: 20, defaultDuration: 30, createdAt: '', updatedAt: '',
    });
    expect(component.isEdit).toBe(true);
  });

  it('pré-remplit le formulaire avec le service existant', () => {
    fixture.componentRef.setInput('service', {
      id: 1, providerId: 1, name: 'Coupe barbe', description: 'Test',
      basePrice: 35, defaultDuration: 45, createdAt: '', updatedAt: '',
    });
    component.ngOnInit();
    expect(component.form.value.name).toBe('Coupe barbe');
    expect(component.form.value.base_price).toBe(35);
    expect(component.form.value.default_duration).toBe(45);
  });

  it('émet submitted avec les bonnes données', () => {
    let emitted: any = null;
    component.submitted.subscribe((dto: any) => emitted = dto);
    component.form.patchValue({ name: 'Coupe', base_price: 25, default_duration: 30 });
    component.onSubmit();
    expect(emitted).not.toBeNull();
    expect(emitted.name).toBe('Coupe');
    expect(emitted.base_price).toBe(25);
  });

  it('ne soumet pas si formulaire invalide', () => {
    let emitted = false;
    component.submitted.subscribe(() => emitted = true);
    component.form.patchValue({ name: '' });
    component.onSubmit();
    expect(emitted).toBe(false);
  });

  it('émet cancelled au clic sur Annuler', () => {
    let cancelled = false;
    component.cancelled.subscribe(() => cancelled = true);
    component.cancelled.emit();
    expect(cancelled).toBe(true);
  });
});
