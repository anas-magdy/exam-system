import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(private router: Router) {}

  handleGetStartedClick(event: Event) {
    event.preventDefault(); // prevent default link behavior
    const token = localStorage.getItem('token');
    if (token) {
      console.log(token);
      this.router.navigate(['/teachers']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
