import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-Login',
  templateUrl: './Login.component.html',
  styleUrls: ['./Login.component.css']
})
export class LoginComponent implements OnInit {

  constructor() { }


  logInGroup: FormGroup = new FormGroup({
    email: new FormControl(),
    password:new FormControl()
  }
  ) 
  ngOnInit() {
  }

}
