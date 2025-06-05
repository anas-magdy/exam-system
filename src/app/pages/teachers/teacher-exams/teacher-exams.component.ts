import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherService, TeacherWithExams } from '../teacher.service';
import { CommonModule } from '@angular/common';
import { ExamService } from './../../exams/exam.service';
@Component({
  selector: 'app-teacher-exams',
  templateUrl: './teacher-exams.component.html',
  styleUrls: ['./teacher-exams.component.css'],
  imports: [CommonModule],
})
export class TeacherExamsComponent {
  teacherData!: TeacherWithExams;
  isLoading = true;
  examCount: number = 0; // ✅ المتغير اللي طلبته

  errorMessage = '';
  noExams = false;
  loadingExamId: string | null = null;
  constructor(
    private route: ActivatedRoute,
    private teacherService: TeacherService,
    private examService: ExamService,
    private router: Router
  ) {
    this.loadTeacherWithExams();
  }

  loadTeacherWithExams() {
    const teacherId = this.route.snapshot.paramMap.get('teacherId')!;
    this.teacherService.getTeacherWithExams(teacherId).subscribe({
      next: (data) => {
        this.teacherData = data;
        this.examCount = data.Exam?.length || 0; // ✅ هنا بنحسب عدد الامتحانات
        this.noExams = !data.Exam || data.Exam.length === 0;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading teacher data:', err);
        this.errorMessage =
          'An error occurred while loading the exams. Please try again later.';
        this.isLoading = false;
      },
    });
  }

  startExam(examId: string) {
    this.loadingExamId = examId; // تشغيل اللودر للامتحان اللي بدأ التحميل
    this.examService.startExam(examId).subscribe({
      next: (examLoaded) => {
        this.loadingExamId = null; // إيقاف اللودر
        if (examLoaded) {
          this.router.navigate(['/exam', examId]);
        } else {
          alert('Failed to start the exam.');
        }
      },
      error: () => {
        this.loadingExamId = null; // إيقاف اللودر حتى لو حصل خطأ
        alert('Failed to start the exam due to network error.');
      },
    });
  }
}
