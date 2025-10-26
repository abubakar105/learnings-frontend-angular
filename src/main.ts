;(window as any).__zone_symbol__UNPATCHED_EVENTS = [
  'touchstart',
  'touchmove',
  'wheel'
];
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { MsalRedirectComponent } from '@azure/msal-angular';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
bootstrapApplication(MsalRedirectComponent, {
  providers: []
}).catch(err => console.error(err));