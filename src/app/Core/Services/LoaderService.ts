import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private loadingSubject = new BehaviorSubject<boolean>(false);

  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  getLoading(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }
}
