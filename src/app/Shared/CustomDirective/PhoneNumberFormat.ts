import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appOnlyNumberWithFormat]',
  standalone : true
})
export class OnlyNumberWithFormatDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event.target.value'])
  onInputChange(value: string): void {
    let digits = value.replace(/\D/g, '');

    if (digits.length > 14) {
      digits = digits.substring(0, 14);
    }

    // Format the number as (XXX) XXX-XXXX XXXX
    let formatted = '';
    if (digits.length > 0) {
      formatted += `(${digits.substring(0, 3)}`;
    }
    if (digits.length >= 4) {
      formatted += `) ${digits.substring(3, 6)}`;
    }
    if (digits.length >= 7) {
      formatted += `-${digits.substring(6, 10)}`;
    }
    if (digits.length > 10) {
      formatted += ` ${digits.substring(10)}`;
    }

    // Update the input field value
    this.el.nativeElement.value = formatted;
  }
}
