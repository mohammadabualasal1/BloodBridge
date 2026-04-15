import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodRequestList } from './blood-request-list';

describe('BloodRequestList', () => {
  let component: BloodRequestList;
  let fixture: ComponentFixture<BloodRequestList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BloodRequestList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BloodRequestList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
