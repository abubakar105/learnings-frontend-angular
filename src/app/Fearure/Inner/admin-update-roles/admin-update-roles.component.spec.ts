import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUpdateRolesComponent } from './admin-update-roles.component';

describe('AdminUpdateRolesComponent', () => {
  let component: AdminUpdateRolesComponent;
  let fixture: ComponentFixture<AdminUpdateRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUpdateRolesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUpdateRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
