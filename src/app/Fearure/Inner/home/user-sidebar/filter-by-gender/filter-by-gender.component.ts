import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProductsFilterService } from '../../../../../Core/Services/ProductsFilterService';
interface GenderOption{
  id: number;
  name: string;
}
@Component({
  selector: 'app-filter-by-gender',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-by-gender.component.html',
  styleUrl: './filter-by-gender.component.css'
})
export class FilterByGenderComponent {

constructor(private filterSvc: ProductsFilterService) {}
categoryList: GenderOption[] = [
    { id: 1, name: 'All' },
    { id: 2, name: 'Male' },
    { id: 3, name: 'Female' },
    { id: 4, name: 'Kids' }
  ];

  selectedGenderId: number | null = 1;

  trackById(_: number, item: GenderOption) {
    return item.id;
  }

  onGenderChange(id: number) {
    this.selectedGenderId = id;
    console.log('Selected gender:', this.categoryList.find(x => x.id === id)?.name);
    const genderName = this.categoryList.find(x => x.id === id)?.name;
    this.filterSvc.setGender(genderName || null);
  }
}
