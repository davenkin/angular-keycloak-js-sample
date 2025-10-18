import {HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {catchError, from, mergeMap, Observable, throwError} from 'rxjs';
import {EnvironmentProviders, inject, makeEnvironmentProviders, provideAppInitializer} from '@angular/core';
import Keycloak from 'keycloak-js';

const AUTH_EXCLUDED_URLS: UrlCondition[] = [];

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
        return await inject(Keycloak).init({onLoad: 'login-required'});
      } catch (error) {
        console.error('Error while initialize keycloak.', error);
        throw error;
      }
    }),
  ]);
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'PATCH';

// either urlPattern or urlIncluded matches
interface UrlCondition {
  urlPattern?: RegExp;
  urlIncluded?: string;
  httpMethods?: HttpMethod[]
}

function canMatch(req: HttpRequest<unknown>, condition: UrlCondition) {
  let urlMatched = condition.urlPattern?.test(req.url) || (condition.urlIncluded ? req.url.includes(condition.urlIncluded) : false);
  if (!urlMatched) {
    return false;
  }

  return condition.httpMethods ? condition.httpMethods.includes(req.method.toUpperCase() as HttpMethod) : true;
}

export function includeBearerTokenInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  let shouldExclude = AUTH_EXCLUDED_URLS.some(it => canMatch(req, it));
  if (shouldExclude) {
    return next(req);
  }

  let keycloak = inject(Keycloak);

  return from((async () => {
    return await keycloak.updateToken().catch(() => false);
  })()).pipe(mergeMap(() => {
    if (keycloak.token) {
      return next(req.clone({
        setHeaders: {
          'Authorization': `Bearer ${keycloak.token}`
        }
      }));
    }
    return next(req);
  }))
}

export function apiResponseErrorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  let keycloak = inject(Keycloak);
  return next(req).pipe(catchError((error: HttpErrorResponse) => {
    if (error.status === 401) {
      keycloak.login();
    }
    return throwError(() => error);
  }));
}
