import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from "./Fearure/shared/spinner/spinner.component";
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { InteractionStatus } from '@azure/msal-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SpinnerComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'learnings';
  
  private msalService = inject(MsalService);
  private msalBroadcastService = inject(MsalBroadcastService);
  private readonly destroying$ = new Subject<void>();
  
  isInitialized = false;

  constructor() {}
  
  async ngOnInit(): Promise<void> {
    console.log('App initializing...');
    
    try {
      console.log('Initializing MSAL...');
      await this.msalService.instance.initialize();
      console.log('MSAL initialized successfully');
      
      await this.msalService.instance.handleRedirectPromise();
      console.log('Redirect promise handled');
      
      this.setActiveAccount();
      
      this.setupMsalEventListeners();
      
      this.isInitialized = true;
      console.log('App initialization complete');
      
    } catch (error) {
      console.error('MSAL initialization failed:', error);
      this.isInitialized = true; // Show app anyway
    }
  }

  private setActiveAccount(): void {
    const accounts = this.msalService.instance.getAllAccounts();
    
    if (accounts.length > 0) {
      this.msalService.instance.setActiveAccount(accounts[0]);
      console.log('Active account set:', accounts[0].username);
    } else {
      console.log('No Azure accounts found');
    }
  }

  private setupMsalEventListeners(): void {
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this.destroying$)
      )
      .subscribe(() => {
        this.setActiveAccount();
      });
  }

  ngOnDestroy(): void {
    this.destroying$.next();
    this.destroying$.complete();
  }
}