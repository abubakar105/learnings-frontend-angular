import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductAttributesComponent } from './add-product-attributes.component';

describe('AddProductAttributesComponent', () => {
  let component: AddProductAttributesComponent;
  let fixture: ComponentFixture<AddProductAttributesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProductAttributesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProductAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
