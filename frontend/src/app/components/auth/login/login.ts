import { Component } from '@angular/core';
import { Auth } from '../../../services/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
    email = '';
  password = '';
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  constructor(private authService: Auth, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.authService.saveToken(response.token);
        const role = response.role;

        if (role === 'Admin') this.router.navigate(['/admin']);
        else if (role === 'Hospital') this.router.navigate(['/hospital']);
        else if (role === 'Donor') this.router.navigate(['/donor']);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 401) {
          this.errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
        } else if (err.status === 0) {
          this.errorMessage = 'تعذّر الاتصال بالخادم.';
        } else {
          this.errorMessage = 'حدث خطأ، حاول مرة أخرى.';
        }
      }
    });
  }

}
