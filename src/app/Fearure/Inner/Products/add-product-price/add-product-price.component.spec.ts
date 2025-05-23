import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductPriceComponent } from './add-product-price.component';

describe('AddProductPriceComponent', () => {
  let component: AddProductPriceComponent;
  let fixture: ComponentFixture<AddProductPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProductPriceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProductPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
