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
  @Input() ind!:number
  constructor() { }

  ngOnInit() {
  }

}
