import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OutsideClickDirective } from '../../../Shared/CustomDirective/OutsideClickDirective';

@Component({
  selector: 'app-multi-select',
  standalone: true,
  imports: [CommonModule,OutsideClickDirective],
  templateUrl: './multi-select.component.html',
  styleUrl: './multi-select.component.css'
})
export class MultiSelectComponent implements OnInit{
  @Input() options: Array<{ id: number; name: string }> = [];
  // Emit only the selected IDs as an array of numbers.
  @Output() selectionChange = new EventEmitter<number[]>();
  get selectedOptionNames(): string {
    return this.selectedOptions.map(o => o.name).join(', ');
  }
  
  ngOnInit(): void {
    console.log(this.options);
  }
  // Keep track of the selected role objects.
  selectedOptions: Array<{ id: number; name: string }> = [];
  dropdownOpen = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  isSelected(option: { id: number; name: string }): boolean {
    return this.selectedOptions.some(o => o.id === option.id);
  }

  onOptionChange(event: Event, option: { id: number; name: string }) {
    const input = event.target as HTMLInputElement;
    if (input.checked) {
      this.selectedOptions.push(option);
    } else {
      this.selectedOptions = this.selectedOptions.filter(o => o.id !== option.id);
    }
    // Emit the updated selected IDs.
    this.selectionChange.emit(this.selectedOptions.map(o => o.id));
  }
}
