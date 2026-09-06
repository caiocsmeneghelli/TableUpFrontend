import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [FormsModule, RouterLink],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {
  email = '';
  password = '';
  error = '';

  constructor(private router: Router) {}

  onSubmit() {
    if (!this.email || !this.password) {
      this.error = 'Informe e-mail e senha.';
      return;
    }

    this.error = '';
    localStorage.setItem('token', 'dummy-token');
    this.router.navigateByUrl('/home');
  }
}
