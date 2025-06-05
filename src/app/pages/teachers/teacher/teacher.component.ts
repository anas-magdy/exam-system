import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Teacher } from '../teacher.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-teacher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css'],
})
export class TeacherComponent {
  @Input() teacher!: Teacher;
  @Input() examCount: number = 0;
  @Output() viewExams = new EventEmitter<string>();

  onViewExams() {
    this.viewExams.emit(this.teacher.id);
  }

  getInitials(name: string): string {
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
}
