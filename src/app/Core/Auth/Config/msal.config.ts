import { 
  IPublicClientApplication, 
  PublicClientApplication,
  InteractionType,
  BrowserCacheLocation,
  LogLevel
} from '@azure/msal-browser';
import { 
  MsalGuardConfiguration,
  MsalInterceptorConfiguration
} from '@azure/msal-angular';
import { environment } from '../../../../enviornments/environment';

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.azureAd.clientId,
      authority: environment.azureAd.authority,
      redirectUri: environment.azureAd.redirectUri,
      postLogoutRedirectUri: environment.azureAd.postLogoutRedirectUri,
      navigateToLoginRequestUrl: true
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: false,
    },
    system: {
      loggerOptions: {
        loggerCallback(logLevel: LogLevel, message: string) {
          switch (logLevel) {
            case LogLevel.Error:
              console.error('MSAL Error:', message);
              break;
            case LogLevel.Warning:
              console.warn('MSAL Warning:', message);
              break;
            case LogLevel.Info:
              console.info('MSAL Info:', message);
              break;
          }
        },
        logLevel: LogLevel.Info, 
        piiLoggingEnabled: false
      },
      allowRedirectInIframe: false
    }
  });
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: environment.azureAd.scopes
    },
    loginFailedRoute: '/admin-login'
  };
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  
  protectedResourceMap.set(`${environment.apiUrl}/AzureUser/*`, environment.azureAd.scopes);
  
  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  };
}