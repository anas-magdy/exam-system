import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../exam.service';
import { TeacherService } from '../../teachers/teacher.service';

@Component({
  selector: 'app-exam-start',
  imports: [],
  templateUrl: './exam-start.component.html',
  styleUrls: ['./exam-start.component.css'],
})
export class ExamStartComponent implements OnInit {
  examId: string = '';
  teacher: any = {};
  exam: any = {};
  isStarting = false;

  constructor(
    private route: ActivatedRoute,
    private examService: ExamService,
    private teacherService: TeacherService,
    private router: Router
  ) {}

  ngOnInit() {
    this.examId = this.route.snapshot.paramMap.get('examId') || '';
    // Load exam details
    this.exam = this.examService.getExamDetails(this?.examId);
    // Load teacher details
    this.teacher = this.teacherService.getTeacherById(this.exam?.teacherId);
    // في دالة ngOnInit
    this.exam = this.examService.getExamDetails(this?.examId);
  }

  startExam() {
    this.isStarting = true;
    this.examService.startExam(this?.examId);
    // أضف هذا السطر لإعادة التوجيه
    this.router.navigate(['/exam/questions']);
  }
}
