import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningPage } from './planning-page';

describe('PlanningPage', () => {
  let component: PlanningPage;
  let fixture: ComponentFixture<PlanningPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanningPage],
    }).compileComponents();

    fixture = TestBed.createComponent(PlanningPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
