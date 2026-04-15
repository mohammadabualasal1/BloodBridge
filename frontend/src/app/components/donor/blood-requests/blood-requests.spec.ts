import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodRequests } from './blood-requests';

describe('BloodRequests', () => {
  let component: BloodRequests;
  let fixture: ComponentFixture<BloodRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BloodRequests]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BloodRequests);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
