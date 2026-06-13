import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningCalendarComponent as PlanningCalendar } from './planning-calendar';

describe('PlanningCalendar', () => {
  let component: PlanningCalendar;
  let fixture: ComponentFixture<PlanningCalendar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanningCalendar],
    }).compileComponents();

    fixture = TestBed.createComponent(PlanningCalendar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
