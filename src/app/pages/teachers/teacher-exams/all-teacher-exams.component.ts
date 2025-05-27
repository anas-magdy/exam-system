import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { TeacherService } from '../teacher.service'; // استيراد الخدمة

@Component({
  selector: 'app-teacher-exams',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './all-teacher-exams.component.html',
  styleUrls: ['./all-teacher-exams.component.css'],
})
export class AllTeacherExamsComponent implements OnInit {
  teacherId: string = '';
  teacher: any = {};
  exams: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private teacherService: TeacherService // حقن الخدمة
  ) {}

  goBack() {
    this.location.back();
  }

  ngOnInit() {
    this.teacherId = this.route.snapshot.paramMap.get('teacherId') || '';
    this.loadTeacherData();
    this.loadExams();
  }

  loadTeacherData() {
    this.teacher = this.teacherService.getTeacherById(this.teacherId) || {};
  }

  loadExams() {
    this.exams = this.teacherService.getTeacherExams(this.teacherId);
  }
}
