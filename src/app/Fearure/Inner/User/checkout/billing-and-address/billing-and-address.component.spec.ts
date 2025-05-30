import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingAndAddressComponent } from './billing-and-address.component';

describe('BillingAndAddressComponent', () => {
  let component: BillingAndAddressComponent;
  let fixture: ComponentFixture<BillingAndAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingAndAddressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingAndAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
