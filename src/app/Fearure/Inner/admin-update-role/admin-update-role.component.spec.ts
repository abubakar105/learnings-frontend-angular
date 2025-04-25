import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUpdateRoleComponent } from './admin-update-role.component';

describe('AdminUpdateRoleComponent', () => {
  let component: AdminUpdateRoleComponent;
  let fixture: ComponentFixture<AdminUpdateRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUpdateRoleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUpdateRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
