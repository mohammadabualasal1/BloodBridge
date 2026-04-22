import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../services/auth';
import { Hospital } from '../../../services/hospital';

@Component({
  selector: 'app-blood-request-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './blood-request-list.html',
  styleUrls: ['./blood-request-list.css']
})
export class BloodRequestList implements OnInit {

  hospitalName = '';
  allRequests: any[] = [];
  filteredRequests: any[] = [];
  isLoading = false;

  filterFrom = '';
  filterTo = '';
  filterStatus = '';

  constructor(private authService: Auth, private hospitalService: Hospital, private router: Router) {}

  ngOnInit() {
    this.hospitalName = localStorage.getItem('name') || 'المستشفى';
    this.loadRequests();
  }

  loadRequests() {
    this.isLoading = true;
    this.hospitalService.getMyRequests().subscribe({
      next: (data) => {
        this.allRequests = data;
        this.filteredRequests = data;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }
  goTo(path: string) {
    this.router.navigate([path]);
  }
  
  applyFilter() {
    this.filteredRequests = this.allRequests.filter(req => {
      const reqDate = new Date(req.createdAt);

      const fromOk = this.filterFrom ? reqDate >= new Date(this.filterFrom) : true;
      const toOk = this.filterTo ? reqDate <= new Date(this.filterTo) : true;
      const statusOk = this.filterStatus ? req.status === this.filterStatus : true;

      return fromOk && toOk && statusOk;
    });
  }

  resetFilter() {
    this.filterFrom = '';
    this.filterTo = '';
    this.filterStatus = '';
    this.filteredRequests = this.allRequests;
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