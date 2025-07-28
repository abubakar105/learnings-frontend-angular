import {
  Injectable,
  ApplicationRef,
  ComponentRef,
  EnvironmentInjector,
} from '@angular/core';
import { createComponent } from '@angular/core';
import { ConfirDialogComponent } from '../../Shared/components/confir-dialog/confir-dialog.component';

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  private dialogRef!: ComponentRef<ConfirDialogComponent>;
  private resolve!: (result: boolean) => void;

  constructor(
    private appRef: ApplicationRef,
    private environmentInjector: EnvironmentInjector
  ) {}

  confirm(
    message: string,
    title: string = 'Confirm'
  ): Promise<boolean> {
    this.dialogRef = createComponent(ConfirDialogComponent, {
      environmentInjector: this.environmentInjector
    });

    this.dialogRef.instance.message = message;
    this.dialogRef.instance.title   = title;

    this.appRef.attachView(this.dialogRef.hostView);

    document.body.appendChild(this.dialogRef.location.nativeElement);

    return new Promise<boolean>(resolve => {
      this.resolve = resolve;
    });
  }

  close(result: boolean) {
    this.resolve(result);

    this.appRef.detachView(this.dialogRef.hostView);
    this.dialogRef.destroy();
  }
}
