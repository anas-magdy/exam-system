import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

// Add to constructor

@Component({
  selector: 'app-teacher-exams',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-teacher-exams.component.html',
  styleUrls: ['./all-teacher-exams.component.css'],
})
export class AllTeacherExamsComponent implements OnInit {
  teacherId: string = '';
  teacher: any = {};
  exams: any[] = [];

  constructor(private route: ActivatedRoute, private location: Location) {}

  // Add this method
  goBack() {
    this.location.back();
  }
  ngOnInit() {
    this.teacherId = this.route.snapshot.paramMap.get('teacherId') || '';
    this.loadTeacherData();
    this.loadExams();
  }

  loadTeacherData() {
    // In a real app, you'd fetch this from a service
    const mockTeachers = [
      {
        id: '1',
        name: 'Bonnie Green',
        title: 'Angular Developer',
        imageUrl:
          'https://flowbite.com/docs/images/people/profile-picture-3.jpg',
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

    this.teacher = mockTeachers.find((t) => t.id === this.teacherId) || {};
  }

  loadExams() {
    // In a real app, you'd fetch this from a service
    this.exams = [
      {
        id: '1',
        title: 'Midterm Exam',
        date: '2023-11-15',
        duration: '90 minutes',
        description: 'Covers chapters 1-5',
      },
      {
        id: '2',
        title: 'Final Exam',
        date: '2023-12-20',
        duration: '120 minutes',
        description: 'Comprehensive exam',
      },
    ];
  }
}
