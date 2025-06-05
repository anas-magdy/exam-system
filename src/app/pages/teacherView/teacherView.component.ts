
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TeacherGetExamsService } from "./teacherGetExams.service"
import Swal from 'sweetalert2';

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

  confirmDelete(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteExam(id);
      }
    });
  }
  
  deleteExam(id: string) {
    this._TeacherGetExamsService.deleteExam(id).subscribe({
      next: () => {
        // Remove the deleted exam from the list
        this.exams = this.exams.filter(exam => exam.id !== id);
        Swal.fire(
          'Deleted!',
          'Your quiz has been deleted.',
          'success'
        );
      },
      error: (err) => {
        console.error("Error deleting exam:", err);
        alert("An error occurred while deleting the quiz.");
      }
    });
  }

  ngOnInit() {
    this._TeacherGetExamsService.getTeacherExams().subscribe({
      next: (res) => {
        this.exams = res.data.Exam
        this.loading = false;
        console.log(res.data)


      },
      error: (err) => {
        this.loading = false
        console.error('Submission error:', err);

      }
    })

  }

}
