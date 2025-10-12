import {ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection} from '@angular/core';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {loginOn401Interceptor, includeBearerTokenInterceptor, provideKeycloak} from './keycloak.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideKeycloak(),
    provideHttpClient(withInterceptors([includeBearerTokenInterceptor, loginOn401Interceptor])),
  ]
};
