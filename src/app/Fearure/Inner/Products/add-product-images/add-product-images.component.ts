import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-product-images',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-product-images.component.html',
  styleUrls: ['./add-product-images.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddProductImagesComponent {
  @Input() files: File[] = [];
  @Output() filesChange = new EventEmitter<File[]>();

  onFileSelect(event: Event) {
    debugger
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    this.emitFiles(input.files);
  }

  onFilesDropped(ev: DragEvent) {
    ev.preventDefault();
    if (!ev.dataTransfer?.files) return;
    this.emitFiles(ev.dataTransfer.files);
  }

  onDragOver(ev: DragEvent) {
    ev.preventDefault();
  }

  private emitFiles(fileList: FileList) {
    const arr = Array.from(fileList);
    this.files = this.files.concat(arr);
    this.filesChange.emit(this.files);
  }

  removeFile(idx: number) {
    this.files.splice(idx, 1);
    this.filesChange.emit(this.files);
  }
}
