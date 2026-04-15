import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorDashboard } from './donor-dashboard';

describe('DonorDashboard', () => {
  let component: DonorDashboard;
  let fixture: ComponentFixture<DonorDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonorDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonorDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
