import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Donor } from '../../../services/donor';

@Component({
  selector: 'app-complete-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './complete-profile.html',
  styleUrls: ['./complete-profile.css']
})
export class CompleteProfile {

  bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  selectedBloodType = '';
  city = '';
  lastDonation = '';
  isLoading = false;
  errorMessage = '';

  constructor(private donorService: Donor, private router: Router) {}

  selectBloodType(type: string) {
    this.selectedBloodType = type;
  }

  onSubmit() {
    if (!this.selectedBloodType) {
      this.errorMessage = 'يرجى اختيار فصيلة الدم.';
      return;
    }
    if (!this.city) {
      this.errorMessage = 'يرجى إدخال المدينة.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const dto = {
      bloodType: this.selectedBloodType,
      city: this.city,
      lastDonation: this.lastDonation ? this.lastDonation : null
    };

    this.donorService.completeProfile(dto).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/donor']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'حدث خطأ، حاول مرة أخرى.';
      }
    });
  }
}