import { Component, ViewEncapsulation } from '@angular/core';
import { LoaderService } from '../../../Core/Services/LoaderService';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom //so that its style is not effect and not other are being affect by this
})
export class SpinnerComponent {
  isLoading$: Observable<boolean>;

  constructor(private loaderService: LoaderService) {
    this.isLoading$ = this.loaderService.getLoading();
  }
}
