import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async register(form: NgForm) {
    if (form.valid) {
      try {
        await this.authService.signUp(this.email, this.password);
        console.log('Registration successful');
        form.reset(); 
        this.router.navigate(['/login']); 
      } catch (error) {
        console.error('Error registering', error);
      }
    } else {
      console.error('Please enter a valid email and password');
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
