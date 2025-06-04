import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/Authntecation.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './Regestaer.component.html',
  styleUrls: ['./Regestaer.component.css'],
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
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        age: ['', [Validators.required, Validators.min(10), Validators.max(100)]],
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
      this.registerForm.get('subjectName')?.setValidators([Validators.required]);
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

  onSubmit() {
    this.formSubmitted = true;
    this.errorMessage = '';

    if (this.userType === 'TEACHER' && !this.idCardImage) {
      this.errorMessage = 'صورة البطاقة الشخصية مطلوبة للمعلمين';
      return;
    }

    if (this.userType === 'TEACHER' && !this.registerForm.value.subjectName?.trim()) {
      this.errorMessage = 'اسم المادة مطلوب للمعلمين';
      return;
    }

    if (this.registerForm.invalid) {
      this.errorMessage = 'الرجاء تعبئة جميع الحقول المطلوبة بشكل صحيح';
      return;
    }

    this.isLoading = true;

    const formData = new FormData();
    formData.append('name', this.registerForm.value.name);
    formData.append('email', this.registerForm.value.email);
    formData.append('age', this.registerForm.value.age.toString());
    formData.append('password', this.registerForm.value.password);
    formData.append('role', this.userType);

    if (this.idCardImage) {
      formData.append('idCardImage', this.idCardImage, this.idCardImage.name);
    }

    if (this.userType === 'TEACHER') {
      formData.append('subjectName', this.registerForm.value.subjectName.trim());
    }

    this.authService.register(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Registration successful:', response);
        this.router.navigate(['/login'], {
          queryParams: { registered: 'true' },
        });
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Registration error:', error);
        this.errorMessage =
          error.error?.message ||
          error.message ||
          'فشل التسجيل. الرجاء التحقق من البيانات والمحاولة مرة أخرى.';
      },
    });
  }
}
