
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../Authntecation.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  providers: [AuthService],
  templateUrl: './Regestaer.component.html',
  styleUrls: ['./Regestaer.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  userType: 'student' | 'teacher' = 'student';
  nationalIdImage: File | null = null;
  formSubmitted = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      userType: ['student', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      age: ['', [Validators.required, Validators.min(10)]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
      ]],
      confirmPassword: ['', [Validators.required]],
      subject: ['']
    }, { validators: this.passwordMatchValidator() });
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const group = control as FormGroup;
      const password = group.get('password')?.value;
      const confirmPassword = group.get('confirmPassword')?.value;
      return password === confirmPassword ? null : { passwordMismatch: true };
    };
  }

  onUserTypeChange(type: 'student' | 'teacher') {
    this.userType = type;
    this.registerForm.patchValue({ userType: type });

    if (type === 'student') {
      this.registerForm.get('subject')?.reset();
      this.nationalIdImage = null;
    }
  }

  onFileSelected(event: any) {
    this.nationalIdImage = event.target.files[0];
  }

  onSubmit() {
    this.formSubmitted = true;

    // Additional validation for teacher registration
    if (this.userType === 'teacher' && !this.nationalIdImage) {
      this.errorMessage = 'National ID image is required for teachers';
      return;
    }

    if (this.registerForm.valid) {
      const formData = new FormData();
      formData.append('username', this.registerForm.value.username);
      formData.append('email', this.registerForm.value.email);
      formData.append('age', this.registerForm.value.age);
      formData.append('password', this.registerForm.value.password);
      formData.append('role', this.userType);

      if (this.userType === 'teacher') {
        if (this.nationalIdImage) {
          formData.append('nationalIdImage', this.nationalIdImage);
        }
        formData.append('subject', this.registerForm.value.subject);
      }

      this.authService.register(formData).subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Registration failed', error);
          this.errorMessage = error.error.message || 'Registration failed. Please try again.';
        }
      });
    }
  }
}
