import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/Authntecation.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './Login.component.html',
  styleUrls: ['./Login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  isLoading = false;
  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // في Login.component.ts
  onSubmit() {
    // Mark all fields as touched to trigger validation messages
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        const role = this.authService.getUserRole();
        console.log(response);
        if (role === 'TEACHER') {
          console.log(response);

          this.router.navigate(['/teacherViewExams']);
        } else if (role === 'STUDENT') {
          console.log(response);
          this.router.navigate(['/teachers']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (error) => {
        this.isLoading = false;

        // Handle different error scenarios
        if (error.status === 401) {
          this.errorMessage = 'Invalid email or password';
        } else if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Login failed. Please try again later.';
        }

        console.error('Login error:', error);
      },
    });
  }
}
