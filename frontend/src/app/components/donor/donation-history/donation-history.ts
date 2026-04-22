import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../../services/auth';
import { Donor } from '../../../services/donor';

@Component({
  selector: 'app-donation-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './donation-history.html',
  styleUrls: ['./donation-history.css']
})
export class DonationHistory implements OnInit {

  donorName = '';
  donations: any[] = [];
  isLoading = false;

  get confirmedCount() { return this.donations.filter(d => d.status === 'Confirmed').length; }
  get pendingCount() { return this.donations.filter(d => d.status === 'Pending').length; }

  constructor(private authService: Auth, private donorService: Donor, private router: Router) {}

  ngOnInit() {
    this.donorName = localStorage.getItem('name') || 'المتبرع';
    this.loadDonations();
  }

  loadDonations() {
    this.isLoading = true;
    this.donorService.getMyDonations().subscribe({
      next: (data) => {
        this.donations = data;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
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