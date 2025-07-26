import { Injectable, inject } from '@angular/core';
import signalR, {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../enviornments/environment';

@Injectable({ providedIn: 'root' })
export class ReviewSignalrService {
  private hub!: HubConnection;
  private newReviewSubject: Subject<any> = new Subject<any>();
  public newReview$ = this.newReviewSubject.asObservable();

  constructor() {
    this.hub = new HubConnectionBuilder()
      .withUrl(`${environment.apiHUBUrl}${environment.hubsPath}`, {
        skipNegotiation: false,
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    this.hub.on('NewReview', (review: any) => {
      this.newReviewSubject.next(review);
    });
    this.start();
  }
  private async start(): Promise<void> {
    try {
      await this.hub.start();
      console.log('SignalR connected');
    } catch (err) {
      console.warn('SignalR failed to connect, retrying in 5s', err);
      setTimeout(() => this.start(), 5000);
    }
  }
}
