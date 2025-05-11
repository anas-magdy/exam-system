import { Component, Input, OnInit } from '@angular/core';
import { QuestionComponent } from './Question/Question.component';
import { IQuestion } from '../Quize.service';

@Component({
  selector: 'app-QuizQuistions',
  templateUrl: './QuizQuistions.component.html',
  styleUrls: ['./QuizQuistions.component.css'],
  imports: [QuestionComponent]

})
export class QuizQuistionsComponent implements OnInit {
  @Input() questions !: IQuestion[]
  constructor() { }

  ngOnInit() {
  }

}
