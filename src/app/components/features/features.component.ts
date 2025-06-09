import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-features',
  imports: [],
  templateUrl: './features.component.html',
  styleUrl: './features.component.css',
})
export class FeaturesComponent {
  constructor(private router: Router) {}

  handleGetStartedClick(event: Event) {
    event.preventDefault();

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<any>(token);
        const role = decoded.role;

        if (role === 'TEACHER') {
          this.router.navigate(['/teacherViewExams']);
        } else if (role === 'STUDENT') {
          console.log(role);
          this.router.navigate(['/teachers']);
        } else {
          this.router.navigate(['/login']);
        }
      } catch (error) {
        console.error('Invalid token:', error);
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
}
