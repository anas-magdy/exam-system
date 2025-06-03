
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/Authntecation.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './Regestaer.component.html',
  styleUrls: ['./Regestaer.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  userType: 'STUDENT' | 'TEACHER' = 'STUDENT';
  idCardImage: File | null = null;
  formSubmitted = false;
  errorMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      age: ['', [Validators.required, Validators.min(10), Validators.max(100)]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
      ]],
      confirmPassword: ['', [Validators.required]],
      subjectName: ['']
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

  onUserTypeChange(type: 'STUDENT' | 'TEACHER') {
    this.userType = type;
    if (type === 'TEACHER') {
      this.registerForm.get('subjectName')?.setValidators([Validators.required]);
    } else {
      this.registerForm.get('subjectName')?.clearValidators();
    }
    this.registerForm.get('subjectName')?.updateValueAndValidity();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const validFormats = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validFormats.includes(file.type)) {
        this.errorMessage = 'Invalid file format. Only JPEG, JPG or PNG images are allowed.';
        event.target.value = '';
        return;
      }

      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        this.errorMessage = 'File is too large. Max size is 2MB.';
        event.target.value = '';
        return;
      }

      this.idCardImage = file;
      this.errorMessage = '';
    }
  }

  onSubmit() {
    this.formSubmitted = true;
    this.errorMessage = '';

    if (this.userType === 'TEACHER' && !this.idCardImage) {
      this.errorMessage = 'National ID image is required for teachers';
      return;
    }

    if (this.registerForm.invalid) {
      this.errorMessage = 'Please fill all required fields correctly';
      return;
    }

    this.isLoading = true;

    const formData = new FormData();
    formData.append('name', this.registerForm.value.name);
    formData.append('email', this.registerForm.value.email);
    formData.append('age', this.registerForm.value.age.toString());
    formData.append('password', this.registerForm.value.password);
    formData.append('role', this.userType);

    if (this.userType === 'TEACHER') {
      if (this.idCardImage) {
        formData.append('idCardImage', this.idCardImage);
      }
      formData.append('subjectName', this.registerForm.value.subjectName);
    }

    this.authService.register(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/login'], {
          queryParams: { registered: 'true' }
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message ||
                          error.message ||
                          'Registration failed. Please check your data and try again.';
        console.error('Registration error:', error);
      }
    });
    console.log('Form submitted:', this.registerForm.value);
  }
}
