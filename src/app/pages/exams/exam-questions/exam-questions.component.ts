import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ExamService } from './../exam.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Exam } from '../exam.model';

@Component({
  selector: 'app-exam-questions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exam-questions.component.html',
  styleUrls: ['./exam-questions.component.css'],
})
export class ExamQuestionsComponent implements OnInit, OnDestroy {
  exam: Exam | null = null;
  answers: number[] = [];
  timeLeft: number = 0;
  private subscriptions: Subscription[] = [];

  constructor(private examService: ExamService, private router: Router) {}

  ngOnInit() {
    this.subscriptions.push(
      this.examService.getCurrentExam().subscribe((exam) => {
        this.exam = exam;
        if (!exam) {
          this.router.navigate(['/teachers']);
          return;
        }
        this.answers = new Array(exam.questions.length).fill(-1);
      })
    );

    this.subscriptions.push(
      this.examService.getExamTimer().subscribe((time) => {
        this.timeLeft = time;
        if (time <= 0) {
          this.submitExam(true);
        }
      })
    );
  }

  // تنسيق الوقت على شكل mm:ss
  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // دالة التسليم (يدوي أو تلقائي)
  submitExam(autoSubmit: boolean = false) {
    if (autoSubmit || confirm('Are you sure you want to submit your exam?')) {
      const result = this.examService.submitExam(this.answers); // ✅ send answers to the service
      console.log(result);
      if (this.exam) {
        this.router.navigate(['/exam-result', this.exam.id]);
      }
    }
  }

  // تنظيف الاشتراكات
  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
