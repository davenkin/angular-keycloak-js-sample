import {HttpEvent, HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EnvironmentProviders, inject, makeEnvironmentProviders, provideAppInitializer} from '@angular/core';
import Keycloak from 'keycloak-js';

export function provideKeycloak(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: Keycloak,
      useValue: new Keycloak({
        url: "http://localhost:8080",
        realm: "test-realm",
        clientId: "test-client"
      })
    },
    provideAppInitializer(async () => {
      try {
        const keycloak = inject(Keycloak);
        return await keycloak.init({onLoad: 'login-required'});
      } catch (error) {
        console.error('Error while initialize keycloak.', error);
        throw error;
      }
    }),
  ]);
}

export const includeBearerTokenInterceptor = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  return next(req);
};
