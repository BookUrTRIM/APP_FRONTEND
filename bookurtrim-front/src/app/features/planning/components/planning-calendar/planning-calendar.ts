import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import {AvailabilityResponseDTO} from '../../models/availability.model';


@Component({
  selector: 'app-planning-calendar',
  standalone: true,
  imports: [DatePipe, NgClass],
  templateUrl: './planning-calendar.html'
})
export class PlanningCalendarComponent implements OnInit {
  @Input() availabilities: AvailabilityResponseDTO[] = [];
  @Output() deleteSlot = new EventEmitter<number>();
  today = new Date();
  currentWeekStart!: Date;
  weekDays: Date[] = [];

  ngOnInit() {
    this.currentWeekStart = this.getStartOfWeek(new Date());
    this.generateWeekDays();
  }

  previousWeek() {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
    this.generateWeekDays();
  }

  nextWeek() {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
    this.generateWeekDays();
  }

  currentWeek() {
    this.currentWeekStart = this.getStartOfWeek(new Date());
    this.generateWeekDays();
  }

  private getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private generateWeekDays() {
    this.weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(this.currentWeekStart);
      day.setDate(day.getDate() + i);
      this.weekDays.push(day);
    }
  }

  getVisualTimelineForDay(date: Date): any[] {
    const dateStr = date.toISOString().split('T')[0];
    const daySlots = this.availabilities.filter(slot => slot.day_date === dateStr);
    if (daySlots.length === 0) return [];
    const works = daySlots.filter(s => s.slot_type === 'work');
    const breaks = daySlots.filter(s => s.slot_type === 'break');
    let timeline: any[] = [];
    works.forEach(work => {
      let currentStart = work.start_time;
      const overlappingBreaks = breaks
        .filter(b => b.start_time < work.end_time && b.end_time > currentStart)
        .sort((a, b) => a.start_time.localeCompare(b.start_time));
      overlappingBreaks.forEach(b => {
        if (b.start_time > currentStart) {
          timeline.push({ ...work, start_time: currentStart, end_time: b.start_time });
        }
        currentStart = b.end_time > currentStart ? b.end_time : currentStart;
      });
      if (currentStart < work.end_time) {
        timeline.push({ ...work, start_time: currentStart, end_time: work.end_time });
      }
    });
    breaks.forEach(b => timeline.push({ ...b }));
    return timeline.sort((a, b) => a.start_time.localeCompare(b.start_time));
  }
}
