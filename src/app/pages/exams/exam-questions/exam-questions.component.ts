import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ExamService } from './../exam.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-exam-questions',
  templateUrl: './exam-questions.component.html',
  styleUrls: ['./exam-questions.component.css'],
})
export class ExamQuestionsComponent implements OnInit, OnDestroy {
  exam: any = null;
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
      })
    );
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  submitExam() {
    if (confirm('Are you sure you want to submit your exam?')) {
      const result = this.examService.submitExam(this.answers);
      this.router.navigate(['/exam-result', this.exam.id]);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
