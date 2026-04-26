import { Routes } from '@angular/router';
import { Login } from './components/auth/login/login';
import { RegisterComponent } from './components/auth/register/register';
import { AdminDashboard } from './components/admin/admin-dashboard/admin-dashboard';
import { authGuard } from './guards/auth-guard';
import { HospitalDashboard } from './components/hospital/hospital-dashboard/hospital-dashboard';
import { DonorDashboard } from './components/donor/donor-dashboard/donor-dashboard';
import { BloodRequestList } from './components/hospital/blood-request-list/blood-request-list';
import { CompleteProfile } from './components/donor/complete-profile/complete-profile';
import { BloodRequests } from './components/donor/blood-requests/blood-requests';
import { DonationHistory } from './components/donor/donation-history/donation-history';
import { Donations } from './components/hospital/donations/donations';
import { Landing } from './components/landing/landing';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: Login },
  { path: 'register', component: RegisterComponent },
  { path: 'admin', component: AdminDashboard, canActivate: [authGuard] },
  { path: 'hospital', component: HospitalDashboard, canActivate: [authGuard] },
  { path: 'hospital/blood-request-list', component: BloodRequestList, canActivate: [authGuard] },
  { path: 'hospital/donations', component: Donations, canActivate: [authGuard] },
  { path: 'donor', component: DonorDashboard, canActivate: [authGuard] },
  { path: 'donor/complete-profile', component: CompleteProfile, canActivate: [authGuard] },
  { path: 'donor/blood-requests', component: BloodRequests, canActivate: [authGuard] },
  { path: 'donor/donation-history', component: DonationHistory, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' },
];