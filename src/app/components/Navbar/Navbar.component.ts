import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './../../Core/auth/Authntecation.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './Navbar.component.html',
  imports: [CommonModule, RouterModule],
  styleUrls: ['./Navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  role: string | null = null;
  isScrolled = false;

  userName: string = '';
  userProfileUrl: string | null = null;

  private authSubscription!: Subscription;
  private userInfoSubscription!: Subscription;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    // ✅ الاشتراك بحالة تسجيل الدخول
    this.authSubscription = this.authService.isLoggedIn$.subscribe(
      (loggedIn) => {
        this.isLoggedIn = loggedIn;
        this.role = loggedIn ? this.authService.getUserRole() : null;

        if (!loggedIn) {
          // إذا خرج من الحساب يتم مسح بيانات المستخدم
          this.userName = '';
          this.userProfileUrl = null;
        }
      }
    );

    // ✅ الاشتراك في بيانات المستخدم المرسلة من السيرفيس
    this.userInfoSubscription = this.authService.userInfo$.subscribe((info) => {
      if (info) {
        this.userName = info.name;
        this.userProfileUrl = info.userProfile?.secure_url || null;
      } else {
        this.userName = '';
        this.userProfileUrl = null;
      }
    });
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 10;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join('');
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
    this.userInfoSubscription?.unsubscribe();
  }
}
