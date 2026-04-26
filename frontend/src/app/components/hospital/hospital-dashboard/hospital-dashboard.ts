import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../../services/auth'
import { Hospital } from '../../../services/hospital';

@Component({
  selector: 'app-hospital-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hospital-dashboard.html',
  styleUrls: ['./hospital-dashboard.css']
})
export class HospitalDashboard implements OnInit {

  hospitalName = '';
  requests: any[] = [];
  isLoading = false;
  isSubmitting = false;
  formError = '';

  newRequest = {
    bloodType: '',
    quantity: null,
    urgency: ''
  };
allRequests: any[] = [];
recentRequests: any[] = [];

get totalRequests() { return this.allRequests.length; }
get pendingRequests() { return this.allRequests.filter(r => r.status === 'Pending').length; }
get fulfilledRequests() { return this.allRequests.filter(r => r.status === 'Fulfilled').length; }
get cancelledRequests() { return this.allRequests.filter(r => r.status === 'Cancelled').length; }
  constructor(private authService: Auth, private hospitalService: Hospital, private router: Router) {}



// بدل requests كلها

 goTo(path: string) {
    this.router.navigate([path]);
  }

  ngOnInit() {
    this.hospitalName = localStorage.getItem('name') || 'المستشفى';
    this.loadRequests();
  }
loadRequests() {
  this.isLoading = true;
  this.hospitalService.getMyRequests().subscribe({
    next: (data) => {
      this.allRequests = data;
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      this.recentRequests = data.filter(r => new Date(r.createdAt) >= sevenDaysAgo);
      this.isLoading = false;
    },
    error: () => { this.isLoading = false; }
  });
}
goToRequests() {
  this.router.navigate(['/hospital/blood-request-list']);
}

  createRequest() {
    if (!this.newRequest.bloodType || !this.newRequest.quantity || !this.newRequest.urgency) {
      this.formError = 'يرجى تعبئة جميع الحقول.';
      return;
    }

    this.isSubmitting = true;
    this.formError = '';

    this.hospitalService.createRequest(this.newRequest).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.newRequest = { bloodType: '', quantity: null, urgency: '' };
        this.loadRequests();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.formError = err.error?.message || 'حدث خطأ، حاول مرة أخرى.';
      }
    });
  }

  cancelRequest(id: number) {
    this.hospitalService.cancelRequest(id).subscribe({
      next: () => { this.loadRequests(); },
      error: () => {}
    });
  }

  getUrgencyClass(urgency: string) {
    switch (urgency) {
      case 'High': return 'urgency-high';
      case 'Medium': return 'urgency-medium';
      case 'Low': return 'urgency-low';
      default: return '';
    }
  }

  getBadgeClass(status: string) {
    switch (status) {
      case 'Pending': return 'badge badge-pending';
      case 'Fulfilled': return 'badge badge-fulfilled';
      case 'Cancelled': return 'badge badge-cancelled';
      default: return 'badge';
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}