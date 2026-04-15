import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalDashboard } from './hospital-dashboard';

describe('HospitalDashboard', () => {
  let component: HospitalDashboard;
  let fixture: ComponentFixture<HospitalDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HospitalDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
