import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  emailError: string = '';
  passwordError: string = '';
  authError: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async login(form: NgForm) {
    this.emailError = '';
    this.passwordError = '';
    this.authError = '';

    if (!this.email) {
      this.emailError = 'Email es requerido';
    }
    if (!this.password) {
      this.passwordError = 'Contraseña es requerida';
    }

    if (!this.emailError && !this.passwordError) {
      try {
        await this.authService.signIn(this.email, this.password);
        form.reset();
        this.router.navigate(['/home']);
      } catch (error) {
        this.authError = 'Credenciales inválidas. Intenta de nuevo.';
        console.error('Error logging in', error);
      }
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
