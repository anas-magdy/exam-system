
import { Component, OnInit } from '@angular/core';
import { QuizQuistionsComponent } from './QuizQuistions/QuizQuistions.component';
import { EditQuizService, IQuiz } from "./EditQuiz.service";
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-EditQuiz',
  templateUrl: './EditQuiz.component.html',
  styleUrls: ['./EditQuiz.component.css'],
  imports: [QuizQuistionsComponent]
})
export class EditQuizComponent implements OnInit {
  quizData!: IQuiz
  quizId!: any;
  loading= false
  constructor(
    private _EditQuizService: EditQuizService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.loading=true
    this.quizId = this.route.snapshot.paramMap.get('id')
    this._EditQuizService.getExam(this.quizId).subscribe({
      next: (res) => {
        this.quizData = res.data
        console.log("annnnnaaaaaaaaaaas", this.quizData)
        this.loading=false
      },
      error: () => {
        console.log("error : عيط يلا")
        this.loading=false
      }
    })
    console.log(this.quizData)
  }

}
