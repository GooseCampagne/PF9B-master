import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router'; // Importa Router

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {} // Inyecta Router

  async register(form: NgForm) {
    if (this.email && this.password) {
      try {
        await this.authService.signUp(this.email, this.password);
        console.log('Registration successful');
        form.reset(); // Limpia el formulario
        this.router.navigate(['/login']); // Redirige a la página de inicio de sesión
      } catch (error) {
        console.error('Error registering', error);
      }
    } else {
      console.error('Email and password are required');
    }
  }
}
