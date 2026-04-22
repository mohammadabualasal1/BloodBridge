import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../../services/auth';
import { Hospital } from '../../../services/hospital';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard implements OnInit {

  hospitals: any = [];
  isLoading = false;
  isSubmitting = false;
  formError = '';
  formSuccess = '';

  newHospital = {
    name: '',
    email: '',
    password: '',
    phone: '',
    city: '',
    address: ''
  };

  get verifiedCount() { return this.hospitals.filter((h: { isVerified: any; }) => h.isVerified).length; }
  get unverifiedCount() { return this.hospitals.filter((h: { isVerified: any; }) => !h.isVerified).length; }

  constructor(private authService: Auth, private hospitalService: Hospital, private router: Router) {}

  ngOnInit() {
    this.loadHospitals();
  }

  loadHospitals() {
    this.isLoading = true;
    this.hospitalService.GetAllHospitals().subscribe({
      next: (data) => {
        this.hospitals = data;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  addHospital() {
    if (!this.newHospital.name || !this.newHospital.email || !this.newHospital.password || !this.newHospital.phone || !this.newHospital.city || !this.newHospital.address) {
      this.formError = 'يرجى تعبئة جميع الحقول.';
      return;
    }

    this.isSubmitting = true;
    this.formError = '';
    this.formSuccess = '';

    // أولاً: سجل المستشفى
    const registerDto = {
      name: this.newHospital.name,
      email: this.newHospital.email,
      password: this.newHospital.password,
      phone: this.newHospital.phone,
      role: 'Hospital'
    };

    this.authService.register(registerDto).subscribe({
      next: (res: any) => {
        // ثانياً: أكمل الـ profile
        const profileDto = {
          userId: res.userId,
          hospitalName: this.newHospital.name,
          city: this.newHospital.city,
          address: this.newHospital.address
        };

        this.hospitalService.completeProfile(profileDto).subscribe({
          next: () => {
            this.isSubmitting = false;
            this.formSuccess = 'تم إضافة المستشفى بنجاح!';
            this.newHospital = { name: '', email: '', password: '', phone: '', city: '', address: '' };
            this.loadHospitals();
          },
          error: (err) => {
            this.isSubmitting = false;
            this.formError = err.error?.message || 'حدث خطأ في إكمال الملف.';
          }
        });
      },
      error: (err) => {
        this.isSubmitting = false;
        this.formError = err.error?.message || 'حدث خطأ في التسجيل.';
      }
    });
  }

  verifyHospital(id: number) {
    this.hospitalService.verifyHospital(id).subscribe({
      next: () => { this.loadHospitals(); },
      error: (err) => { alert(err.error?.message || 'حدث خطأ'); }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}