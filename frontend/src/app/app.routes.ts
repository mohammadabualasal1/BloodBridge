import { Routes } from '@angular/router';
import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';
import { AdminDashboard } from './components/admin/admin-dashboard/admin-dashboard';
import { authGuard } from './guards/auth-guard';
import { HospitalDashboard } from './components/hospital/hospital-dashboard/hospital-dashboard';
import { DonorDashboard } from './components/donor/donor-dashboard/donor-dashboard';

export const routes: Routes = [
     { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'admin', component: AdminDashboard, canActivate: [authGuard] },
  { path: 'hospital', component: HospitalDashboard, canActivate: [authGuard] },
  { path: 'donor', component: DonorDashboard, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];
