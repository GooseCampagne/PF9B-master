import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router'; // Importa Router

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {} // Inyecta Router

  async login(form: NgForm) {
    if (this.email && this.password) {
      try {
        await this.authService.signIn(this.email, this.password);
        console.log('Login successful');
        form.reset(); // Limpia el formulario
        this.router.navigate(['/home']); // Redirige a la página de inicio
      } catch (error) {
        console.error('Error logging in', error);
      }
    } else {
      console.error('Email and password are required');
    }
  }
}
