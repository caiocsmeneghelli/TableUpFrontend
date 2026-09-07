import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  email = '';
  password = '';
  error = signal('');

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit() {
    if (!this.email || !this.password) {
      this.error.set('Informe e-mail e senha.');
      return;
    }

    this.error.set('');
    this.authService.login({ username: this.email, password: this.password }).subscribe({
      next: (result) => {
        if (!result.isSuccess || !result.value) {
          this.error.set(result.error || 'Não foi possível entrar.');
          return;
        }

        localStorage.setItem('token', result.value);
        this.router.navigateByUrl('/home');
      },
      error: () => {
        this.error.set('Não foi possível entrar.');
      },
    });
  }
}
