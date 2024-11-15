import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, HTTP_INTERCEPTORS, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { routes } from './app.routes';
import { LoadingInterceptor } from './Core/Interceptors/loading';
import { TokenInterceptor } from './Core/Interceptors/AuthInterceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      BrowserAnimationsModule,
      ToastrModule.forRoot({
        timeOut: 3000,
        positionClass: 'toast-top-right',
        preventDuplicates: true, 
      })
    ),
    provideHttpClient(withInterceptorsFromDi()), // Allows interceptors in DI
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }, // Register interceptor
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }, // Register interceptor
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
  ],
};
