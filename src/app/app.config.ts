import {ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection} from '@angular/core';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {apiResponseErrorInterceptor, includeBearerTokenInterceptor, provideKeycloak} from './keycloak.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideKeycloak(),
    provideHttpClient(withInterceptors([includeBearerTokenInterceptor, apiResponseErrorInterceptor])),
  ]
};
