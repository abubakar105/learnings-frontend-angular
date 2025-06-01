import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductImagesComponent } from './add-product-images.component';

describe('AddProductImagesComponent', () => {
  let component: AddProductImagesComponent;
  let fixture: ComponentFixture<AddProductImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProductImagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProductImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
