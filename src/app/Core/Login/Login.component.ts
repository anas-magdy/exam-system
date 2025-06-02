// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { ReactiveFormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';

// @Component({
//   standalone: true,
//   imports: [ReactiveFormsModule, CommonModule],
//   templateUrl: './Login.component.html',
//   styleUrls: ['./Login.component.css']
// })
// export class LoginComponent {
//   loginForm: FormGroup;

//   constructor(private fb: FormBuilder) {
//     this.loginForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required, Validators.minLength(6)]]
//     });
//   }

//   onSubmit() {
//     if (this.loginForm.valid) {
//       console.log('Form submitted:', this.loginForm.value);
//       // Add your login logic here
//     }
//   }
// }


import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../Authntecation.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './Login.component.html',
  styleUrls: ['./Login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response: any) => {
          // تخزين التوكن
          if (response.token) {
            this.authService.setToken(response.token);
          }

          // توجيه المستخدم بناءً على دوره
          if (response.role === 'TEACHER') {
            this.router.navigate(['/teacher-dashboard']);
          } else {
            this.router.navigate(['/student-dashboard']);
          }
        },
        error: (error) => {
          console.error('Login failed', error);
          this.errorMessage = error.error?.message || 'Login failed. Please check your credentials.';
        }
      });
    }
  }
}
