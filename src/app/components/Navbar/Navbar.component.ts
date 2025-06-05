import { Component, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // ✅ لازم Router

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './Navbar.component.html',
  imports: [CommonModule, RouterModule],
  styleUrls: ['./Navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  role: string | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
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
