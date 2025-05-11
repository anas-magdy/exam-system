import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-QuizName',
  templateUrl: './QuizName.component.html',
  styleUrls: ['./QuizName.component.css'],
  imports: [FormsModule, ]
})
export class QuizNameComponent implements OnInit {
  @Input() quizName: string = ""

  constructor() { }

  ngOnInit() {
  }

}
