import { TestBed } from '@angular/core/testing';
import { ClientProfileFormComponent } from './client-profile-form';
import { Gender, HairLength, HairType } from '../../enums';
import type { ClientProfileModel } from '../../models';

const makeProfile = (): ClientProfileModel => ({
  id: 1, userAccountId: 5,
  firstName: 'Alice', lastName: 'Martin',
  phone: '06 00 00 00 00',
  gender: Gender.FEMME,
  hairLength: HairLength.LONG,
  hairType: HairType.BOUCLE,
  historyPreferences: 'Coupe régulière',
  stripeCustomerId: null,
  createdAt: '', updatedAt: '',
});

describe('ClientProfileFormComponent — logique', () => {
  let component: ClientProfileFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientProfileFormComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(ClientProfileFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('profile', makeProfile());
  });

  it('crée le composant', () => expect(component).toBeTruthy());

  it('le formulaire contient tous les champs', () => {
    expect(component.form.contains('first_name')).toBe(true);
    expect(component.form.contains('last_name')).toBe(true);
    expect(component.form.contains('phone')).toBe(true);
    expect(component.form.contains('gender')).toBe(true);
    expect(component.form.contains('hair_length')).toBe(true);
    expect(component.form.contains('hair_type')).toBe(true);
  });

  it('genderOptions contient 3 options', () => {
    expect(component.genderOptions.length).toBe(3);
  });

  it('hairLengthOptions contient 4 options', () => {
    expect(component.hairLengthOptions.length).toBe(4);
  });

  it('hairTypeOptions contient 5 options', () => {
    expect(component.hairTypeOptions.length).toBe(5);
  });

  it('émet submitted au onSubmit', () => {
    component.form.patchValue({ first_name: 'Alice', last_name: 'Martin' });
    let emitted: any = null;
    component.submitted.subscribe((dto: any) => emitted = dto);
    component.onSubmit();
    expect(emitted).not.toBeNull();
  });
});
