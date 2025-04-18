import { Directive, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[dropdown]',
  standalone: true
})
export class DropdownDirective implements OnChanges {
  @Input() open: boolean;
  @Output() clickOutside = new EventEmitter<MouseEvent>();

  constructor(private _renderer: Renderer2, private _elem: ElementRef) {}

  ngOnChanges(): void {
    const dropdownMenu = this._elem.nativeElement.querySelector('.dropdown-menu');
    if (!dropdownMenu) {
      return;
    }
    if (this.open) {
      this._renderer.addClass(dropdownMenu, 'show');
    } else {
      this._renderer.removeClass(dropdownMenu, 'show');
    }
  }

  @HostListener('document:click', ['$event', '$event.target'])
  onClick(event: MouseEvent, targetElement: HTMLElement): void {
    if (!targetElement) {
      return;
    }
    const clickInside = this._elem.nativeElement.contains(targetElement);
    // Use this.open (not open()) to check if the dropdown is open.
    if (!clickInside && this.open) {
      this.clickOutside.emit(event);
    }
  }
}
