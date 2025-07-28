import { Component } from '@angular/core';
import { ConfirmDialogService } from '../../../Core/Services/ConfirmDialogService';

@Component({
  selector: 'app-confir-dialog',
  standalone: true,
  imports: [],
  templateUrl: './confir-dialog.component.html',
  styleUrl: './confir-dialog.component.css'
})
export class ConfirDialogComponent {
title = 'Confirm';
  message = 'Are you sure?';

  constructor(private service: ConfirmDialogService) {}

  confirm() {
    this.service.close(true);
  }

  cancel() {
    this.service.close(false);
  }
}
