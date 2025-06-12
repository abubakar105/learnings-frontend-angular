// src/app/services/image-upload.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviornments/environment';

export interface CloudinaryResponse {
  public_id: string;
  secure_url: string;
}

@Injectable({ providedIn: 'root' })
export class ImageUploadService {
  private url = `https://api.cloudinary.com/v1_1/${environment.cloudinary.cloudName}/image/upload`;
  private preset = environment.cloudinary.uploadPreset;

  constructor(private http: HttpClient) {}

  // in ImageUploadService
uploadFile(file: Blob, fileName?: string): Observable<CloudinaryResponse> {
  const form = new FormData();
  form.append('file', file, fileName);
  form.append('upload_preset', this.preset);
  return this.http.post<CloudinaryResponse>(this.url, form);
}

}
