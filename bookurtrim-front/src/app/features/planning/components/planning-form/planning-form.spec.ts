import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningFormComponent as PlanningForm } from './planning-form';

describe('PlanningForm', () => {
  let component: PlanningForm;
  let fixture: ComponentFixture<PlanningForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanningForm],
    }).compileComponents();

    fixture = TestBed.createComponent(PlanningForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
