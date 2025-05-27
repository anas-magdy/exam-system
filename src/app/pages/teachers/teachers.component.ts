import { Component } from '@angular/core';
import { TeacherComponent } from './teacher/teacher.component';
import { AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TeacherService } from './teacher.service';

declare var window: any;

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [CommonModule, TeacherComponent, FormsModule],
  templateUrl: './teachers.component.html',
  styleUrl: './teachers.component.css',
})
export class TeachersComponent implements AfterViewInit {
  constructor(
    private router: Router,
    private teacherService: TeacherService // حقن الخدمة
  ) {}

  ngAfterViewInit(): void {
    if (window?.Flowbite?.initDropdowns) {
      window.Flowbite.initDropdowns();
    }
  }

  currentPage = 1;
  itemsPerPage = 8;
  searchQuery = '';
  selectedTitle = '';

  // الحصول على عناوين المدرسين من الخدمة
  get titles() {
    return this.teacherService.getTeacherTitles();
  }

  // تصفية المدرسين باستخدام الخدمة
  get filteredTeachers() {
    return this.teacherService.searchTeachers(
      this.searchQuery,
      this.selectedTitle
    );
  }

  get teachers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredTeachers.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  get totalPages() {
    return Math.ceil(this.filteredTeachers.length / this.itemsPerPage);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPageNumbers(): number[] {
    const maxPagesToShow = 5;
    const half = Math.floor(maxPagesToShow / 2);
    let start = Math.max(1, this.currentPage - half);
    let end = Math.min(this.totalPages, start + maxPagesToShow - 1);

    if (end - start + 1 < maxPagesToShow) {
      start = Math.max(1, end - maxPagesToShow + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  resetFilters() {
    this.searchQuery = '';
    this.selectedTitle = '';
    this.currentPage = 1;
  }

  viewTeacherExams(teacherId: string) {
    this.router.navigate(['/teachers', teacherId, 'exams']);
  }
}
