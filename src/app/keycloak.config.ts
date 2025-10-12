import {HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {catchError, from, mergeMap, Observable, throwError} from 'rxjs';
import {EnvironmentProviders, inject, makeEnvironmentProviders, provideAppInitializer} from '@angular/core';
import Keycloak from 'keycloak-js';

const BEARER_TOKEN_EXCLUDED_URLS: UrlCondition[] = [];

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

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'PATCH';

interface UrlCondition {
  urlPattern: RegExp;
  httpMethods?: HttpMethod[]
}

function canMatch(req: HttpRequest<unknown>, condition: UrlCondition) {
  let patternMatched = condition.urlPattern.test(req.url);
  if (!patternMatched) {
    return false;
  }

  return condition.httpMethods ? condition.httpMethods.includes(req.method.toUpperCase() as HttpMethod) : true;
}

export function includeBearerTokenInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  let shouldExclude = BEARER_TOKEN_EXCLUDED_URLS.some(it => canMatch(req, it));
  if (shouldExclude) {
    return next(req);
  }

  let keycloak = inject(Keycloak);

  return from((async () => {
    return await keycloak.updateToken().catch(() => false);
  })()).pipe(mergeMap(() => {
    return next(req.clone({
      setHeaders: {
        'Authorization': `Bearer ${keycloak.token}`
      }
    }));
  }))
}

export function loginOn401Interceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  return next(req).pipe(catchError((error: HttpErrorResponse) => {
    if (error.status === 401) {
      inject(Keycloak).login();
    }
    return throwError(() => error);
  }));
}
