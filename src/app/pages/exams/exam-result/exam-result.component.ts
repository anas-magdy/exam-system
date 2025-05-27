import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExamResult } from './../exam-result.model';
import { ExamService } from './../exam.service';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'app-exam-result',
  templateUrl: './exam-result.component.html',
  styleUrls: ['./exam-result.component.css'],
})
export class ExamResultComponent implements OnInit {
  examId: string = '';
  result: ExamResult | null = null;
  exam: any = null;

  constructor(
    private route: ActivatedRoute,
    private examService: ExamService
  ) {}

  ngOnInit() {
    this.examId = this.route.snapshot.paramMap.get('examId') || '';
    // In real app, fetch result from API
    const savedResult = localStorage.getItem(`exam-result-${this.examId}`);
    if (savedResult) {
      this.result = JSON.parse(savedResult);
    }
    // Get exam details
    this.exam = this.examService.getExamDetails(this.examId);
  }

  getPercentageColor(percentage: number): string {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  }
}
