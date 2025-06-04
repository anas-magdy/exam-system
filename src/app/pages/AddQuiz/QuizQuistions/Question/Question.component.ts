import { FormsModule } from '@angular/forms';
import { Component, Input, OnInit, Output ,EventEmitter} from '@angular/core';
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
  @Output() delete = new EventEmitter<number>();
  constructor() { }

  ngOnInit() {

  }
  handleDelete() {
    this.delete.emit(this.ind);
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
  deleteChoice(key: string) {
    this.question.options = this.question.options.filter(opt => opt.key !== key);

    this.question.options.forEach((opt, index) => {
      opt.key = String.fromCharCode(65 + index);
    });
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