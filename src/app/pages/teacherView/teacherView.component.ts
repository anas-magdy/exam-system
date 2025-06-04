
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TeacherGetExamsService } from "./teacherGetExams.service"



interface Exam {
  id: string;
  name: string;
  duration: string;
  grade: number;
  questions: {
    id: string;
    theQuestion: string;
    examId: string;
    options: any[];
  }[];
  teacherId: string;
}
@Component({
  selector: 'app-teacherView',
  templateUrl: './teacherView.component.html',
  styleUrls: ['./teacherView.component.css'],
  imports: [RouterLink]
})
export class TeacherViewComponent implements OnInit {
  exams: Exam[] = [];
  loading = true;
  constructor(private _TeacherGetExamsService: TeacherGetExamsService) { }

  ngOnInit() {
    this._TeacherGetExamsService.getTeacherExams().subscribe({
      next: (res) => {
        this.exams = res.data.Exam
        this.loading = false;
        console.log(res.data)
       
        
      },
      error: (err) => {
        this.loading=false
        console.error('Submission error:', err);
      
      }
    })

  }

}
