import { Component, ChangeDetectorRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/Authntecation.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './Regestaer.component.html',
  styleUrls: ['./Regestaer.component.css'],
})
export class RegisterComponent {
  userProfile: File | null = null;
  registerForm: FormGroup;
  userType: 'STUDENT' | 'TEACHER' = 'STUDENT';
  idCardImage: File | null = null;
  formSubmitted = false;
  errorMessage = '';
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        age: [
          '',
          [Validators.required, Validators.min(10), Validators.max(100)],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
        subjectName: [''],
      },
      { validators: this.passwordMatchValidator() }
    );
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
      this.registerForm
        .get('subjectName')
        ?.setValidators([Validators.required]);
    } else {
      this.registerForm.get('subjectName')?.clearValidators();
    }
    this.registerForm.get('subjectName')?.updateValueAndValidity();
    this.cd.detectChanges();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop().toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'jfif'];

    if (!allowedExtensions.includes(fileExtension)) {
      this.errorMessage = 'يجب أن يكون الملف من نوع JPEG أو PNG أو JFIF فقط';
      event.target.value = '';
      this.idCardImage = null;
      return;
    }

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      this.errorMessage = 'حجم الملف كبير جداً (الحد الأقصى 2MB)';
      event.target.value = '';
      this.idCardImage = null;
      return;
    }

    this.idCardImage = file;
    this.errorMessage = '';
  }

  onStudentImageSelected(event: any) {
    const file = event.target.files[0];
    if (!file) {
      this.userProfile = null; // مسح أي صورة محفوظة إذا تم إلغاء التحديد
      return;
    }

    const fileExtension = file.name.split('.').pop().toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'jfif'];

    if (!allowedExtensions.includes(fileExtension)) {
      this.errorMessage = 'يجب أن يكون الملف من نوع JPEG أو PNG أو JFIF فقط';
      event.target.value = '';
      this.userProfile = null;
      return;
    }

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      this.errorMessage = 'حجم الملف كبير جداً (الحد الأقصى 2MB)';
      event.target.value = '';
      this.userProfile = null;
      return;
    }

    this.userProfile = file;
    this.errorMessage = '';
  }

  onSubmit() {
    this.formSubmitted = true;
    this.errorMessage = '';

    // Mark all fields as touched to trigger validation messages
    this.registerForm.markAllAsTouched();

    // Teacher-specific validations
    if (this.userType === 'TEACHER' && !this.idCardImage) {
      this.errorMessage = 'National ID image is required for teachers';
      return;
    }

    if (
      this.userType === 'TEACHER' &&
      !this.registerForm.value.subjectName?.trim()
    ) {
      this.errorMessage = 'Subject name is required for teachers';
      return;
    }

    if (this.registerForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly';
      return;
    }

    this.isLoading = true;

    const formData = new FormData();
    formData.append('name', this.registerForm.value.name);
    formData.append('email', this.registerForm.value.email);
    formData.append('age', this.registerForm.value.age.toString());
    formData.append('password', this.registerForm.value.password);
    formData.append('role', this.userType);

    // Add ID card image for teachers
    if (this.idCardImage) {
      formData.append('idCardImage', this.idCardImage, this.idCardImage.name);
    }

    // Add profile photo (optional)
    if (this.userProfile) {
      console.log('userProfile:', this.userProfile);
      formData.append('userProfile', this.userProfile, this.userProfile.name);
    }

    if (this.userType === 'TEACHER') {
      formData.append(
        'subjectName',
        this.registerForm.value.subjectName.trim()
      );
    }
    this.authService.register(formData).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.isLoading = false;
        this.router.navigate(['/login'], {
          queryParams: { registered: 'true' },
        });
      },
      error: (error) => {
        this.isLoading = false;

        // Handle different error scenarios
        if (error.status === 400 && error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error.error?.errors) {
          // Handle validation errors from backend
          const errors = error.error.errors;
          this.errorMessage = Object.values(errors).join('\n');
        } else {
          this.errorMessage =
            'Registration failed. Please check your data and try again.';
        }

        console.error('Registration error:', error);
      },
    });
  }
}
