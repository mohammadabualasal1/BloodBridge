import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../services/auth';
import { Donor } from '../../../services/donor';
import { Notification } from '../../../services/notification';

@Component({
  selector: 'app-donor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './donor-dashboard.html',
  styleUrls: ['./donor-dashboard.css']
})
export class DonorDashboard implements OnInit {

  donorName = '';
  profile: any = null;
  totalDonations = 0;
  availableRequests = 0;

  // إشعارات
  notifications: any = [];
  showNotifications = false;

  get unreadCount() {
    return this.notifications.filter((n: { isRead: any; }) => !n.isRead).length;
  }

  constructor(
    private authService: Auth,
    private donorService: Donor,
    private notifService: Notification,
    private router: Router
  ) {}

  ngOnInit() {
    this.donorName = localStorage.getItem('name') || 'المتبرع';
    this.loadProfile();
    this.loadStats();
    this.loadNotifications();
  }

  loadProfile() {
    this.donorService.getProfile().subscribe({
      next: (data) => { this.profile = data; },
      error: (err) => {
        if (err.status === 404) {
          this.router.navigate(['/donor/complete-profile']);
        }
      }
    });
  }

  loadStats() {
    this.donorService.getMyDonations().subscribe({
      next: (data) => { this.totalDonations = data.length; },
      error: () => {}
    });
    this.donorService.getBloodRequests().subscribe({
      next: (data) => { this.availableRequests = data.length; },
      error: () => {}
    });
  }

  loadNotifications() {
    this.notifService.getNotifications().subscribe({
      next: (data) => { this.notifications = data; },
      error: () => {}
    });
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  onNotifClick(notif: any) {
    if (!notif.isRead) {
      this.notifService.markAsRead(notif.id).subscribe({
        next: () => {
          notif.isRead = true;
          this.router.navigate(['/donor/blood-requests']);
          this.showNotifications = false;
        },
        error: () => {}
      });
    } else {
      this.router.navigate(['/donor/blood-requests']);
      this.showNotifications = false;
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