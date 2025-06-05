import { Component, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // ✅ ضروري علشان routerLink يشتغل
@Component({
  selector: 'app-navbar',
  templateUrl: './Navbar.component.html',
  imports: [CommonModule, RouterModule],
  styleUrls: ['./Navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  role: string | null = null;

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
}
