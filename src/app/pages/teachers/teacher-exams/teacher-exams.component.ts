import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { TeacherService } from '../teacher.service';
import { Teacher } from './../../../models/Teacher.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-teacher-exams',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './teacher-exams.component.html',
  styleUrls: ['./teacher-exams.component.css'],
})
export class AllTeacherExamsComponent implements OnInit {
  teacherId: string = '';
  teacher: any = {
    name: '',
    title: '',
    imageUrl: '',
  };
  exams: any[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private teacherService: TeacherService
  ) {}

  goBack() {
    // بدل ما تستخدم location.back() خلي الرجوع يعيد تحميل الصفحة
    this.router.navigate(['/teachers']);
  }

  ngOnInit() {
    const teacherIdParam = this.route.snapshot.paramMap.get('teacherId');
    this.teacherId = teacherIdParam || '';

    if (this.teacherId) {
      this.loadData();
    } else {
      this.error = 'Teacher ID not found';
      this.loading = false;
    }
  }

  loadData() {
    this.loading = true;
    this.error = '';

    forkJoin({
      teacher: this.teacherService.getTeacherById(this.teacherId),
      exams: this.teacherService.getTeacherExams(this.teacherId),
    }).subscribe({
      next: (data) => {
        this.setupTeacherData(data.teacher);
        this.exams = data.exams || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading data:', err);
        this.error = 'Failed to load teacher data. Please try again.';
        this.loading = false;
      },
    });
  }

  private setupTeacherData(teacherData: Teacher) {
    this.teacher = {
      name:
        teacherData.idCardData?.doctorName ||
        teacherData.user?.name ||
        'Unknown Teacher',
      title: teacherData.user?.role || 'Teacher',
      imageUrl:
        teacherData.idCardImage?.secure_url ||
        'assets/images/default-avatar.png',
    };
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'assets/images/default-avatar.png';
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  formatDuration(duration: number): string {
    if (!duration) return 'Not specified';
    if (duration < 60) {
      return `${duration} minutes`;
    } else {
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
  }
}
