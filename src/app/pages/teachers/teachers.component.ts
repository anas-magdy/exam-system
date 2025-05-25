import { Component } from '@angular/core';
import { TeacherComponent } from './teacher/teacher.component';
import { AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
declare var window: any;
@Component({
  selector: 'app-teachers',
  imports: [CommonModule, TeacherComponent],
  templateUrl: './teachers.component.html',
  styleUrl: './teachers.component.css',
})
export class TeachersComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    if (window?.Flowbite?.initDropdowns) {
      window.Flowbite.initDropdowns();
    }
  }
  allTeachers = [
    {
      name: 'Bonnie Green',
      title: 'Angular Developer',
      imageUrl: 'https://flowbite.com/docs/images/people/profile-picture-3.jpg',
    },
    {
      name: 'Ahmed Ali',
      title: 'React Developer',
      imageUrl: 'https://randomuser.me/api/portraits/men/75.jpg',
    },
    {
      name: 'Sara Mohamed',
      title: 'Vue.js Developer',
      imageUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
    },
    {
      name: 'John Doe',
      title: 'Full Stack Developer',
      imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      name: 'Bonnie Green',
      title: 'Angular Developer',
      imageUrl: 'https://flowbite.com/docs/images/people/profile-picture-3.jpg',
    },
    {
      name: 'Ahmed Ali',
      title: 'React Developer',
      imageUrl: 'https://randomuser.me/api/portraits/men/75.jpg',
    },
    {
      name: 'Sara Mohamed',
      title: 'Vue.js Developer',
      imageUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
    },
    {
      name: 'John Doe',
      title: 'Full Stack Developer',
      imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      name: 'Sara Mohamed',
      title: 'Vue.js Developer',
      imageUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
    },
    {
      name: 'John Doe',
      title: 'Full Stack Developer',
      imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      name: 'Sara Mohamed',
      title: 'Vue.js Developer',
      imageUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
    },
    {
      name: 'John Doe',
      title: 'Full Stack Developer',
      imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
  ];

  currentPage = 1;
  itemsPerPage = 8;

  get teachers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.allTeachers.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.allTeachers.length / this.itemsPerPage);
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
}
