import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ServiceQuestionsComponent } from './service-questions';
import { ServiceQuestionApiContract } from '../../services/service-question.api.contract';

class MockApi extends ServiceQuestionApiContract {
  getByService = vi.fn().mockReturnValue(of([]));
  create       = vi.fn().mockReturnValue(of({ id: 1, service_id: 1, question: 'Q?', options: [], order: 1 }));
  update       = vi.fn().mockReturnValue(of({ id: 1, service_id: 1, question: 'Q?', options: [], order: 1 }));
  delete       = vi.fn().mockReturnValue(of(undefined));
}

describe('ServiceQuestionsComponent — logique', () => {
  let component: ServiceQuestionsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceQuestionsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ServiceQuestionApiContract, useClass: MockApi },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(ServiceQuestionsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('serviceId', 1);
  });

  it('crée le composant', () => expect(component).toBeTruthy());

  it('editingId est null initialement', () => {
    expect(component.editingId()).toBeNull();
  });

  it('le formulaire requiert question', () => {
    component.form.patchValue({ question: '' });
    expect(component.form.get('question')!.hasError('required')).toBe(true);
  });

  it('addOption ajoute une option au FormArray', () => {
    const initial = component.optionsArray.length;
    component.addOption();
    expect(component.optionsArray.length).toBe(initial + 1);
  });

  it('removeOption supprime une option si > 1', () => {
    component.addOption();
    component.addOption();
    const before = component.optionsArray.length;
    component.removeOption(0);
    expect(component.optionsArray.length).toBe(before - 1);
  });

  it('removeOption ne supprime pas si une seule option', () => {
    component.addOption();
    while (component.optionsArray.length > 1) component.optionsArray.removeAt(0);
    expect(component.optionsArray.length).toBe(1);
    component.removeOption(0);
    expect(component.optionsArray.length).toBe(1);
  });

  it('cancelEdit remet editingId à null', () => {
    component.editingId.set(5);
    component.cancelEdit();
    expect(component.editingId()).toBeNull();
  });
});
