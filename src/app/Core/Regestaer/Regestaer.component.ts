
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthntecationService } from '../Authntecation.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule , HttpClientModule],
  templateUrl: './Regestaer.component.html',
  styleUrls: ['./Regestaer.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  userType: 'student' | 'teacher' = 'student';

  constructor(
    private fb: FormBuilder,
    private authService: AuthntecationService
  ) {
    this.registerForm = this.fb.group({
      userType: ['student', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
      ]],
      confirmPassword: ['', [Validators.required]],
      subject: [''],
      experience: [''],
      qualifications: ['']
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
    if (type === 'student') {
      this.registerForm.patchValue({
        subject: '',
        experience: '',
        qualifications: ''
      });
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;

      let userData: FormData | { username: string; email: string; password: string; role: string };

      if (this.userType === 'teacher') {
        userData = new FormData();
        userData.append('username', formData.username);
        userData.append('email', formData.email);
        userData.append('password', formData.password);
        userData.append('role', 'teacher');
        userData.append('subject', formData.subject);
        userData.append('experience', formData.experience);
        userData.append('qualifications', formData.qualifications);
      } else {
        userData = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: 'student'
        };
      }

      this.authService.register(userData).subscribe({
        next: (response) => {
          console.log('Registration successful', response);
        },
        error: (error) => {
          console.error('Registration failed', error);
        }
      });
    }
  }
}
