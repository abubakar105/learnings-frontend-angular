import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterByGenderComponent } from './filter-by-gender.component';

describe('FilterByGenderComponent', () => {
  let component: FilterByGenderComponent;
  let fixture: ComponentFixture<FilterByGenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterByGenderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterByGenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
