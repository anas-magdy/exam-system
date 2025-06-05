import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ExamService } from './../../exam.service';
import { Exam, Question } from '../../exam.model';
import { Router } from '@angular/router'; // ✅ import Router

@Component({
  selector: 'app-exam-result',
  standalone: true,
  imports: [CommonModule],

  templateUrl: './exam-result.component.html',
  styleUrls: ['./exam-result.component.css'],
})
export class ExamResultComponent implements OnInit {
  exam: Exam | null = null;
  userAnswers: number[] = [];
  score: number = 0;
  total: number = 0;
  percentage: number = 0;

  constructor(
    private examService: ExamService,
    private route: ActivatedRoute,
    private router: Router // ✅ Inject Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const examId = params.get('id');
      if (!examId) {
        // التعامل مع الحالة: مثلاً إعادة التوجيه أو رسالة خطأ
        return;
      }

      const stored = localStorage.getItem(`exam-result-${examId}`);

      if (stored) {
        const result = JSON.parse(stored);
        this.userAnswers = result.answers || [];
        this.score = result.score || 0;
        this.total = result.totalScore ?? 0;
        this.percentage = result.percentage ?? 0;
      } else {
        // ممكن تهيئة افتراضية أو رسالة للمستخدم
        this.userAnswers = [];
        this.score = 0;
        this.total = 0;
        this.percentage = 0;
      }

      this.examService.getCurrentExam().subscribe((exam) => {
        this.exam = exam;

        if (exam && this.total === 0) {
          this.total = exam.questions.length * 10;
          this.percentage =
            this.score > 0 ? Math.round((this.score / this.total) * 100) : 0;
        }
      });
    });
  }

  goToTeachers() {
    this.router.navigate(['/teachers']);
  }
  trackByQuestionId(index: number, question: Question) {
    return question.id;
  }
}
