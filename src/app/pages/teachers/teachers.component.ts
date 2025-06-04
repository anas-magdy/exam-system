import { Component } from '@angular/core';
import { TeacherComponent } from './teacher/teacher.component';
import { AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TeacherService } from './teacher.service';
import { Teacher } from './teacher.service';

declare var window: any;

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [CommonModule, TeacherComponent, FormsModule],
  templateUrl: './teachers.component.html',
  styleUrl: './teachers.component.css',
})
export class TeachersComponent implements AfterViewInit, OnInit {
  constructor(private router: Router, private teacherService: TeacherService) {}

  ngAfterViewInit(): void {
    if (window?.Flowbite?.initDropdowns) {
      window.Flowbite.initDropdowns();
    }
  }

  examCounts: { [key: string]: number } = {};

  ngOnInit() {
    this.loadTeachers();
    this.loadExamCounts();
  }

  currentPage = 1;
  itemsPerPage = 8;
  searchQuery = '';
  selectedSubject = '';
  allTeachers: Teacher[] = [];
  filteredTeachers: Teacher[] = [];
  isLoading = true;

  async loadTeachers() {
    this.isLoading = true;
    try {
      this.allTeachers =
        (await this.teacherService.getAllTeachers().toPromise()) || [];
      this.filterTeachers();
    } catch (error) {
      console.error('Error loading teachers:', error);
    } finally {
      this.isLoading = false;
    }
  }

  get teachers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredTeachers.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  loadExamCounts() {
    this.allTeachers.forEach((teacher) => {
      this.teacherService
        .getTeacherExamCount(teacher.id)
        .subscribe((count) => (this.examCounts[teacher.id] = count));
    });
  }

  getExamCount(teacherId: string): number {
    return this.examCounts[teacherId] || 0;
  }
  get totalPages() {
    return Math.ceil(this.filteredTeachers.length / this.itemsPerPage);
  }

  get subjects() {
    return [
      ...new Set(
        this.allTeachers.map(
          (teacher) => teacher.subjectName.toLowerCase() // تحويل لصيغة موحدة
        )
      ),
    ].map((subject) => subject.charAt(0).toUpperCase() + subject.slice(1));
  }
  filterTeachers() {
    this.currentPage = 1;
    this.filteredTeachers = this.allTeachers.filter((teacher) => {
      const matchesSearch = teacher.user.name
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase());

      const matchesSubject =
        !this.selectedSubject ||
        teacher.subjectName.toLowerCase() ===
          this.selectedSubject.toLowerCase();

      return matchesSearch && matchesSubject;
    });
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
    this.selectedSubject = '';
    this.filterTeachers();
  }

  viewTeacherExams(teacherId: string) {
    this.teacherService.getTeacherExams(teacherId).subscribe({
      next: (exams) => {
        this.router.navigate(['/teachers', teacherId, 'exams'], {
          state: { exams },
        });
      },
      error: (err) => {
        console.error('❌ Error fetching exams:', err);
        this.router.navigate(['/teachers', teacherId, 'exams'], {
          state: { error: err.message || 'Error loading exams' },
        });
      },
    });
  }
}
