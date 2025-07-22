// src/app/services/image-upload.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { catchError, filter, map, Observable, of } from 'rxjs';
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
uploadFileProgress(file: Blob, fileName?: string): Observable<HttpEvent<CloudinaryResponse>> {
    const form = new FormData();
    form.append('file', file, fileName);
    form.append('upload_preset', this.preset);

    return this.http.post<CloudinaryResponse>(this.url, form, {
      reportProgress: true,
      observe: 'events',
    });
  }

uploadFile$(file: File): Observable<string | null> {
    return this.uploadFileProgress(file, file.name).pipe(
      // Only pass through the final response event
      filter(event => event.type === HttpEventType.Response),
      // Extract secure_url
      map((event: HttpEvent<any>) => (event as any).body.secure_url as string),
      catchError(err => {
        console.error(`Upload failed for ${file.name}`, err);
        return of<string | null>(null);
      })
    );
  }
}
