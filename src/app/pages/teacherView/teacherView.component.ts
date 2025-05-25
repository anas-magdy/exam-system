import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-teacherView',
  templateUrl: './teacherView.component.html',
  styleUrls: ['./teacherView.component.css'],
  imports: [RouterLink]
})
export class TeacherViewComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
