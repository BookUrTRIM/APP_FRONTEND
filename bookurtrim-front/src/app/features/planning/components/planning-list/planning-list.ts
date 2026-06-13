import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass, DatePipe } from '@angular/common';
import {AvailabilityResponseDTO} from '../../models/availability.model';

@Component({
  selector: 'app-planning-list',
  standalone: true,
  imports: [NgClass, DatePipe],
  templateUrl: './planning-list.html'
})
export class PlanningListComponent {
  @Input() availabilities: AvailabilityResponseDTO[] = [];
  @Input() currentPage = 1;
  @Input() itemsPerPage = 10;
  @Output() deleteSlot = new EventEmitter<number>();
  @Output() pageChange = new EventEmitter<number>();

  Math = Math;

  get paginatedAvailabilities() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.availabilities.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.availabilities.length / this.itemsPerPage) || 1;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.pageChange.emit(this.currentPage + 1);
  }

  prevPage() {
    if (this.currentPage > 1) this.pageChange.emit(this.currentPage - 1);
  }

  onDelete(id: number) {
    this.deleteSlot.emit(id);
  }
}
