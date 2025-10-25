import { Injectable, inject } from '@angular/core';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { 
  AuthenticationResult, 
  EventMessage, 
  EventType, 
  InteractionStatus 
} from '@azure/msal-browser';
import { Observable, Subject, filter, takeUntil } from 'rxjs';
import { environment } from '../../../../enviornments/environment';

export interface AzureUserProfile {
  userId: string;
  email: string;
  name: string;
  isAuthenticated: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AzureAuthService {
  private msalService = inject(MsalService);
  private msalBroadcastService = inject(MsalBroadcastService);
  
  private readonly _destroying$ = new Subject<void>();
  private userProfile$ = new Subject<AzureUserProfile | null>();

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
        takeUntil(this._destroying$)
      )
      .subscribe((result: EventMessage) => {
        const payload = result.payload as AuthenticationResult;
        this.msalService.instance.setActiveAccount(payload.account);
        this.updateUserProfile();
      });

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.checkAndSetActiveAccount();
        this.updateUserProfile();
      });
  }

  private checkAndSetActiveAccount(): void {
    const activeAccount = this.msalService.instance.getActiveAccount();
    
    if (!activeAccount && this.msalService.instance.getAllAccounts().length > 0) {
      const accounts = this.msalService.instance.getAllAccounts();
      this.msalService.instance.setActiveAccount(accounts[0]);
    }
  }

  private updateUserProfile(): void {
    const account = this.msalService.instance.getActiveAccount();
    
    if (account) {
      const profile: AzureUserProfile = {
        userId: account.localAccountId,
        email: account.username,
        name: account.name || account.username,
        isAuthenticated: true
      };
      this.userProfile$.next(profile);
    } else {
      this.userProfile$.next(null);
    }
  }

  loginWithAzure(): void {
    this.msalService.loginRedirect({
      scopes: environment.azureAd.scopes,
    });
  }

  logoutFromAzure(): void {
    this.msalService.logoutRedirect({
      postLogoutRedirectUri: environment.azureAd.postLogoutRedirectUri
    });
  }

  getAccessToken(): Observable<string> {
    return new Observable(observer => {
      const account = this.msalService.instance.getActiveAccount();
      
      if (!account) {
        observer.error('No active account');
        return;
      }

      this.msalService.acquireTokenSilent({
        scopes: environment.azureAd.scopes,
        account: account
      }).subscribe({
        next: (result: AuthenticationResult) => {
          observer.next(result.accessToken);
          observer.complete();
        },
        error: (error) => {
          console.error('Token acquisition failed', error);
          this.msalService.acquireTokenRedirect({
            scopes: environment.azureAd.scopes
          });
          observer.error(error);
        }
      });
    });
  }

  isAuthenticated(): boolean {
    const account = this.msalService.instance.getActiveAccount();
    return account !== null;
  }

  getUserProfile(): Observable<AzureUserProfile | null> {
    return this.userProfile$.asObservable();
  }

  getCurrentUserProfile(): AzureUserProfile | null {
    const account = this.msalService.instance.getActiveAccount();
    
    if (account) {
      return {
        userId: account.localAccountId,
        email: account.username,
        name: account.name || account.username,
        isAuthenticated: true
      };
    }
    
    return null;
  }

  destroy(): void {
    this._destroying$.next();
    this._destroying$.complete();
  }
}