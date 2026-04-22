import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../../services/auth';
import { Hospital } from '../../../services/hospital';

@Component({
  selector: 'app-donations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './donations.html',
  styleUrls: ['./donations.css']
})
export class Donations implements OnInit {

  hospitalName = '';
  donations: any[] = [];
  isLoading = false;

  constructor(private authService: Auth, private hospitalService: Hospital, private router: Router) {}

  ngOnInit() {
    this.hospitalName = localStorage.getItem('name') || 'المستشفى';
    this.loadDonations();
  }

  loadDonations() {
    this.isLoading = true;
    this.hospitalService.getHospitalDonations().subscribe({
      next: (data) => {
        this.donations = data;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  confirm(id: number) {
    this.hospitalService.confirmDonation(id).subscribe({
      next: () => { this.loadDonations(); },
      error: (err) => { alert(err.error?.message || 'حدث خطأ'); }
    });
  }

  reject(id: number) {
    this.hospitalService.rejectDonation(id).subscribe({
      next: () => { this.loadDonations(); },
      error: (err) => { alert(err.error?.message || 'حدث خطأ'); }
    });
  }

  getBadgeClass(status: string) {
    switch (status) {
      case 'Pending': return 'badge badge-pending';
      case 'Confirmed': return 'badge badge-confirmed';
      case 'Rejected': return 'badge badge-rejected';
      default: return 'badge';
    }
  }

  getStatusLabel(status: string) {
    switch (status) {
      case 'Pending': return 'معلق';
      case 'Confirmed': return 'مؤكد';
      case 'Rejected': return 'مرفوض';
      default: return status;
    }
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}