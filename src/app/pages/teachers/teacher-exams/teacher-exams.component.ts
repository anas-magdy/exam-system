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
  errorMessage = '';
  noExams = false;

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

  // startExam(examId: string) {
  //   this.examService.fetchExamFromApi(examId).subscribe({
  //     next: (exam) => {
  //       this.examService['currentExam$'].next(exam); // أو تضيف دالة setCurrentExam في الخدمة
  //       // إذا حابب تبدأ المؤقت هنا، ممكن تنادي
  //       const totalSeconds = exam.duration * 60;
  //       this.examService['examTimer$'].next(totalSeconds);

  //       // التنقل لصفحة الأسئلة
  //       this.router.navigate(['/exam', examId]);
  //     },
  //     error: (err) => {
  //       console.error('Error fetching exam:', err);
  //       alert('Failed to load exam. Please try again.');
  //     },
  //   });
  // }
  startExam(examId: string) {
    this.examService.startExam(examId).subscribe((examLoaded) => {
      if (examLoaded) {
        this.router.navigate(['/exam', examId]); // ✅ التنقل بعد تحميل الامتحان
      } else {
        alert('Failed to start the exam.');
      }
    });
  }
}
