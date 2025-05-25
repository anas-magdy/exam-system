import { Component, Input } from '@angular/core';

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
}
