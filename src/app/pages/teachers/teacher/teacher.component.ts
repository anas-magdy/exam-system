import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-teacher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css'],
})
export class TeacherComponent {
  @Input() name!: string;
  @Input() title!: string;
  @Input() imageUrl!: string;
  @Input() teacherId!: string;

  @Output() viewExams = new EventEmitter<string>();

  // صورة افتراضية في حالة فشل تحميل الصورة
  defaultImageUrl = 'assets/images/default-avatar.png';

  onViewExams() {
    this.viewExams.emit(this.teacherId);
  }

  // دالة للتعامل مع خطأ تحميل الصورة
  onImageError(event: any) {
    event.target.src = this.defaultImageUrl;
  }

  // دالة للتحقق من وجود الصورة
  get displayImageUrl(): string {
    return this.imageUrl || this.defaultImageUrl;
  }
}
