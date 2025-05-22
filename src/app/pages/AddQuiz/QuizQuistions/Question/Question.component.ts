import { FormsModule } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { IQuestion } from '../../Quize.service';

@Component({
  selector: 'app-Question',
  templateUrl: './Question.component.html',
  styleUrls: ['./Question.component.css'],
  imports: [FormsModule]
})
export class QuestionComponent implements OnInit {
  @Input() question!: IQuestion
  @Input() ind!: number
  constructor() { }

  ngOnInit() {

  }

  get validChoice(): boolean {
    return this.question.Choices.length < 4 &&
      this.question.Choices[this.question.Choices.length - 1]?.value !== '';
  }
  handelAddChoice() {
    console.log(this.question.Choices)
    if (this.question.Choices.length < 4 && this.question.Choices[this.question.Choices.length - 1].value != '') {
      this.question.Choices.push({
        key: String.fromCharCode(65 + this.question.Choices.length),
        value: ''
      })
    }
  }
}
