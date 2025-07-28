import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { RegisterUserComponent } from '../../Fearure/Auth/register-user/register-user.component';

@Injectable({ providedIn: 'root' })
export class PendingChangesGuard
  implements CanDeactivate<RegisterUserComponent>
{
  canDeactivate(component: RegisterUserComponent) {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}
