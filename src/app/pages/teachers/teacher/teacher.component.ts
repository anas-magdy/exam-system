import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Teacher } from '../teacher.service';

@Component({
  selector: 'app-teacher',
  standalone: true,
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css'],
})
export class TeacherComponent {
  @Input() teacher!: Teacher; // نستقبل كائن المدرس كاملاً بدلاً من خصائص منفصلة
  @Output() viewExams = new EventEmitter<string>();
  @Input() examCount: number = 0;
  onViewExams() {
    this.viewExams.emit(this.teacher.id); // نستخدم teacher.id بدلاً من teacherId
  }
}
