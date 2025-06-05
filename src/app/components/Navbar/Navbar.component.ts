

import { Component, Inject, Injectable, OnInit, PLATFORM_ID } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './Navbar.component.html',
  imports: [CommonModule, RouterModule],
  styleUrls: ['./Navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }
  isLoggedIn: boolean = false;
  role: string | null = null;


  private getToken(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token') || '';
    }
    return '';
  }
  ngOnInit() {
    const token = this.getToken();
    if (token) {
      try {
        const decoded = jwtDecode<{ role: string }>(token);
        this.role = decoded.role;
        this.isLoggedIn = true;
      } catch (err) {
        console.error('Invalid token', err);
        this.isLoggedIn = false;
      }
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedIn = false;
    this.router.navigate(['/']); // توجيه للصفحة الرئيسية
  }
}
