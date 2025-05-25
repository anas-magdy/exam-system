import { Component } from '@angular/core';
import { TeacherComponent } from './teacher/teacher.component';
import { AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

declare var window: any;

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [CommonModule, TeacherComponent, FormsModule],
  templateUrl: './teachers.component.html',
  styleUrl: './teachers.component.css',
})
export class TeachersComponent implements AfterViewInit {
  constructor(private router: Router) {}
  ngAfterViewInit(): void {
    if (window?.Flowbite?.initDropdowns) {
      window.Flowbite.initDropdowns();
    }
  }

  allTeachers = [
    {
      id: '1',
      name: 'Bonnie Green',
      title: 'Angular Developer',
      imageUrl: 'https://flowbite.com/docs/images/people/profile-picture-3.jpg',
    },
    {
      id: '2',
      name: 'Ahmed Ali',
      title: 'React Developer',
      imageUrl: 'https://randomuser.me/api/portraits/men/75.jpg',
    },
    {
      id: '3',
      name: 'Layla Hassan',
      title: 'Vue.js Expert',
      imageUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
    },
    {
      id: '4',
      name: 'Mohamed Zidan',
      title: 'Full Stack Developer',
      imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      id: '5',
      name: 'Sara Ibrahim',
      title: 'UI/UX Designer',
      imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      id: '6',
      name: 'John Carter',
      title: 'Node.js Developer',
      imageUrl: 'https://randomuser.me/api/portraits/men/46.jpg',
    },
    {
      id: '7',
      name: 'Fatima Noor',
      title: 'Backend Engineer',
      imageUrl: 'https://randomuser.me/api/portraits/women/23.jpg',
    },
    {
      id: '8',
      name: 'Omar Adel',
      title: 'DevOps Specialist',
      imageUrl: 'https://randomuser.me/api/portraits/men/81.jpg',
    },
    {
      id: '9',
      name: 'Amira Saeed',
      title: 'Mobile Developer',
      imageUrl: 'https://randomuser.me/api/portraits/women/19.jpg',
    },
    {
      id: '10',
      name: 'Khaled Tarek',
      title: 'Python Instructor',
      imageUrl: 'https://randomuser.me/api/portraits/men/54.jpg',
    },
    {
      id: '11',
      name: 'Nada Mostafa',
      title: 'Java Developer',
      imageUrl: 'https://randomuser.me/api/portraits/women/37.jpg',
    },
    {
      id: '12',
      name: 'Youssef Kamal',
      title: 'AI Engineer',
      imageUrl: 'https://randomuser.me/api/portraits/men/15.jpg',
    },
    {
      id: '13',
      name: 'Reem Hossam',
      title: 'Cybersecurity Analyst',
      imageUrl: 'https://randomuser.me/api/portraits/women/49.jpg',
    },
    {
      id: '14',
      name: 'Tamer Hassan',
      title: 'Cloud Architect',
      imageUrl: 'https://randomuser.me/api/portraits/men/28.jpg',
    },
  ];

  currentPage = 1;
  itemsPerPage = 8;
  searchQuery = '';
  selectedTitle = '';

  // Get unique titles for filter dropdown
  get titles() {
    return [...new Set(this.allTeachers.map((teacher) => teacher.title))];
  }

  // Filter teachers based on search and title filter
  get filteredTeachers() {
    return this.allTeachers.filter((teacher) => {
      const matchesSearch = teacher.name
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase());
      const matchesTitle =
        !this.selectedTitle || teacher.title === this.selectedTitle;
      return matchesSearch && matchesTitle;
    });
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

  // Simplified exam data in English
  getExams(teacherId: string): any[] {
    return [
      {
        id: '1',
        title: 'Midterm Exam',
        date: '2023-11-15',
        duration: '90 minutes',
      },
      {
        id: '2',
        title: 'Final Exam',
        date: '2023-12-20',
        duration: '120 minutes',
      },
    ];
  }

  // Cleaned up viewTeacherExams method
  viewTeacherExams(teacherId: string) {
    this.router.navigate(['/teachers', teacherId, 'exams']);
  }
}
