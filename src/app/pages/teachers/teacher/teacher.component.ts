import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-teacher',
  standalone: true,
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css'],
})
export class TeacherComponent {
  @Input() name!: string;
  @Input() title!: string;
  @Input() imageUrl!: string;
  @Input() teacherId!: string;

  @Output() viewExams = new EventEmitter<string>();

  onViewExams() {
    this.viewExams.emit(this.teacherId); // ترسل teacherId للمكون الأب
  }
}


