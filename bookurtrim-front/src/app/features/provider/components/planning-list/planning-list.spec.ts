import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningListComponent as PlanningList } from './planning-list';

describe('PlanningList', () => {
  let component: PlanningList;
  let fixture: ComponentFixture<PlanningList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanningList],
    }).compileComponents();

    fixture = TestBed.createComponent(PlanningList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
