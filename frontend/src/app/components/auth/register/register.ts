import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../services/auth'


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {

  name = '';
  email = '';
  phone = '';
  password = '';
  confirmPassword = '';
  showPassword = false;
  showConfirmPassword = false;
  passwordMismatch = false;
  isLoading = false;
  errorMessage = '';

  constructor(private authService: Auth, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  checkPasswordMatch() {
    this.passwordMismatch = this.confirmPassword !== '' && this.password !== this.confirmPassword;
  }

  onSubmit() {
    if (!this.name || !this.email || !this.phone || !this.password) {
      this.errorMessage = 'يرجى تعبئة جميع الحقول.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.passwordMismatch = true;
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const dto = {
      name: this.name,
      email: this.email,
      phone: this.phone,
      password: this.password,
      role: 'Donor'
    };

    this.authService.register(dto).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 400) {
          this.errorMessage = err.error?.message || 'البريد الإلكتروني مستخدم مسبقاً.';
        } else if (err.status === 0) {
          this.errorMessage = 'تعذّر الاتصال بالخادم.';
        } else {
          this.errorMessage = 'حدث خطأ، حاول مرة أخرى.';
        }
      }
    });
  }
}