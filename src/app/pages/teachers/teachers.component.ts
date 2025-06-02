import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TeacherComponent } from './teacher/teacher.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { TeacherService } from './teacher.service';
import { Teacher } from '../../models/Teacher.model';
import { filter } from 'rxjs/operators';

declare var window: any;

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [CommonModule, TeacherComponent, FormsModule],
  templateUrl: './teachers.component.html',
  styleUrl: './teachers.component.css',
})
export class TeachersComponent implements AfterViewInit, OnInit {
  allTeachers: Teacher[] = [];
  filteredTeachers: Teacher[] = [];

  constructor(private router: Router, private teacherService: TeacherService) {}

  currentPage = 1;
  itemsPerPage = 8;
  searchQuery = '';
  selectedTitle = '';

  ngOnInit(): void {
    this.loadTeachers();

    // ✅ تحميل البيانات كل مرة ترجع للصفحة
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadTeachers();
      });
  }

  loadTeachers(): void {
    this.teacherService.getAllTeachers().subscribe({
      next: (teachers) => {
        this.allTeachers = teachers;
        this.filteredTeachers = [...teachers];
      },
      error: (err) => console.error('Error loading teachers:', err),
    });
  }

  ngAfterViewInit(): void {
    if (window?.Flowbite?.initDropdowns) {
      window.Flowbite.initDropdowns();
    }
  }

  // استخراج الأدوار من idCardData
  get titles(): string[] {
    const uniqueTitles = [
      ...new Set(this.allTeachers.map((t) => t.idCardData?.role)),
    ];
    return uniqueTitles.filter((title) => title);
  }

  filterTeachers(): void {
    this.filteredTeachers = this.allTeachers.filter((teacher) => {
      const matchesSearch =
        !this.searchQuery.trim() ||
        teacher.idCardData?.doctorName
          ?.toLowerCase()
          .includes(this.searchQuery.toLowerCase().trim());

      const matchesRole =
        !this.selectedTitle.trim() ||
        teacher.idCardData?.role === this.selectedTitle;

      return matchesSearch && matchesRole;
    });

    this.currentPage = 1;
  }

  onSearchChange(): void {
    this.filterTeachers();
  }

  onFilterChange(): void {
    this.filterTeachers();
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
    this.filteredTeachers = [...this.allTeachers];
    this.currentPage = 1;
  }

  viewTeacherExams(teacherId: string) {
    this.router.navigate(['/teachers', teacherId, 'exams']);
  }
}
