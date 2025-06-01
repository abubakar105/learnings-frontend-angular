import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortByFilterComponent } from './sort-by-filter.component';

describe('SortByFilterComponent', () => {
  let component: SortByFilterComponent;
  let fixture: ComponentFixture<SortByFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SortByFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SortByFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
