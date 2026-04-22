import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../../services/auth';
import { Donor } from '../../../services/donor';

@Component({
  selector: 'app-blood-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blood-requests.html',
  styleUrls: ['./blood-requests.css']
})
export class BloodRequests implements OnInit {

  donorName = '';
  requests: any[] = [];
  isLoading = false;
  isDonating = false;

  constructor(private authService: Auth, private donorService: Donor, private router: Router) {}

  ngOnInit() {
    this.donorName = localStorage.getItem('name') || 'المتبرع';
    this.loadRequests();
  }

  loadRequests() {
    this.isLoading = true;
    this.donorService.getBloodRequests().subscribe({
      next: (data) => {
        this.requests = data;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  donate(bloodRequestId: number) {
    this.isDonating = true;
    this.donorService.createDonation(bloodRequestId).subscribe({
      next: () => {
        this.isDonating = false;
        this.loadRequests();
      },
      error: (err) => {
        this.isDonating = false;
        alert(err.error?.message || 'حدث خطأ، حاول مرة أخرى.');
      }
    });
  }

  getUrgencyClass(urgency: string) {
    switch (urgency) {
      case 'High': return 'urgency-badge urgency-high';
      case 'Medium': return 'urgency-badge urgency-medium';
      case 'Low': return 'urgency-badge urgency-low';
      default: return 'urgency-badge';
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