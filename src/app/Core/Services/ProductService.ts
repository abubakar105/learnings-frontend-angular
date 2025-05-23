// auth.service.ts
import { Injectable } from '@angular/core';
import { environment } from '../../../enviornments/environment';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient, private router: Router) {}
  getAllLookupAttributes(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/ProductsLookUpAttribute`);
  }
  addProduct(body:any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Products`, body);
  }
  uploadFile(file: File): Observable<string> {
    const form = new FormData();
    form.append('file', file);
    return this.http
      .post<{ url: string }>('/api/files/upload', form)
      .pipe(map(res => res.url));
  }

}
