import { FormsModule } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { IQuestion } from '../../Quize.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-Question',
  templateUrl: './Question.component.html',
  styleUrls: ['./Question.component.css'],
  imports: [FormsModule, CommonModule]
})
export class QuestionComponent implements OnInit {
  @Input() question!: IQuestion
  @Input() ind!: number
  constructor() { }

  ngOnInit() {

  }

  get validChoice(): boolean {
    return this.question.options.length < 4 &&
      this.question.options[this.question.options.length - 1]?.option !== '';
  }
  handelAddChoice() {
    console.log(this.question.options)
    if (this.question.options.length < 4 && this.question.options[this.question.options.length - 1].option != '') {
      this.question.options.push({
        key: String.fromCharCode(65 + this.question.options.length),
        option: '',
        isCorrect: false
      })
    }
  }
  getCorrectAnswerKey(): string | null {
    const correct = this.question.options.find(opt => opt.isCorrect);
    return correct ? correct.key : null;
  }
  onCorrectAnswerChange(selectedKey: string) {

    console.log(selectedKey)
    this.question.options.forEach(option => {
      option.isCorrect = option.key === selectedKey;
    });
  }
}