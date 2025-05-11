import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FlowbitService } from '../ui/flowbit.service';
import { initFlowbite } from 'flowbite';
import { AddQuizComponent } from './pages/AddQuiz/AddQuiz.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,AddQuizComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  title = 'myapp';
  constructor(private _flowbit: FlowbitService) { }
  ngOnInit(): void {
    this._flowbit.loadFlowbite((flowbit) => {
      initFlowbite();
    })
  }
}
