import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ExamService } from './../../exam.service';
import { Exam } from '../../exam.model';

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
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const examId = params.get('id');
      const stored = localStorage.getItem(`exam-result-${examId}`);

      if (stored) {
        const result = JSON.parse(stored);
        this.userAnswers = result.answers;
        this.score = result.score;
        this.total = result.totalScore;
        this.percentage = result.percentage;
      }

      this.examService.getCurrentExam().subscribe((exam) => {
        this.exam = exam;
      });
    });
  }
}
