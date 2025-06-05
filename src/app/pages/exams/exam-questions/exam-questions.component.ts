import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ExamService } from './../exam.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Exam } from '../exam.model';
import Swal from 'sweetalert2'; // ⬅️ استيراد SweetAlert

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
  loading: boolean = false;

  ngOnInit() {
    this.subscriptions.push(
      this.examService.getCurrentExam().subscribe((exam) => {
        this.exam = exam;
        if (!exam) {
          console.log(exam);
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

  submitExam(autoSubmit: boolean = false) {
    if (autoSubmit) {
      this.finalSubmit();
    } else {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to go back!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#16a34a',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, submit it!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.finalSubmit();
        }
      });
    }
  }

  private finalSubmit() {
    this.loading = true; // ➡️ تشغيل اللودر

    this.examService.submitExam(this.answers).subscribe({
      next: () => {
        this.loading = false; // ➡️ إيقاف اللودر عند النجاح
        if (this.exam) {
          this.router.navigate(['/exam-result', this.exam.id]);
        }
      },
      error: (err) => {
        this.loading = false; // ➡️ إيقاف اللودر عند الخطأ
        const errorMessage = err.error?.message || 'Something went wrong';
        Swal.fire({
          icon: 'error',
          title: 'Submission Failed',
          text: errorMessage,
          confirmButtonColor: '#d33',
        }).then(() => {
          this.router.navigate(['/teachers']);
        });
      },
    });
  }

  // تنظيف الاشتراكات
  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
