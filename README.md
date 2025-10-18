## Introduction

This is a sample project for using [Keycloak JavaScript adapter](https://www.keycloak.org/securing-apps/javascript-adapter) in Angular project.

This application requires the user to be logged in for all its pages, this actually simplifies the authentication mechanism by only checking the user's login status at a single place early in the application's initialization process.

## Tech stack
- Angular 20.3.0
- keycloak-js 26.2.0

## Local run
- First start Keycloak server: `./start-local-keyloak.sh`, this starts the Keycloak server at [http://localhost:8080](http://localhost:8080) with an admin user named `admin` and password `admin`. 
- In Keycloak UI, navigate to realm `test-realm`, create a user and set the password
- Run `npm start`, then open your browser and navigate to [http://localhost:4200/](http://localhost:4200/) and login with the previously created user


## Local Keycloak Server
The local Keycloak server by default has the following set up:
- A realm `test-realm` with a client `test-client`
- For `test-client`:
  - `Client authentication` set to `off` as the Angular application is a public client
  - `Authentication flow` set to `Standard flow` to enable the Oauth2 authorization flow
  - `Valid redirect URIs` set to `http://localhost:4200/*`, which points our the local Angular application
  - `Web origins` set to `*` to allow all domains for CORS requests, only for testing purpose

## How it works
- It is assumed that the whole application requires the user to be authenticated by configuring `{onLoad: 'login-required'}` for `Keycloak.init()`.
- The Keycloak initialization is done via `provideKeycloak()`, this will log the user in even before the UI renders.
- When calling backend APIs, access token is added as `Bearer` token except configured explicitly as excluded in `BEARER_TOKEN_EXCLUDED_URLS` by yourself.
- Every access token attached API request will call `Keycloak.updateToken()` to automatically refresh the token if needed, refer to `includeBearerTokenInterceptor()` for more detail. If the refresh fails, login page is displayed.
- If API responses with 401 error which means authentication failed, the `apiResponseErrorInterceptor()` will display the login page asking the user to login.
- By default, a check login iframe is added by `keycloak-js`, it will periodically check if the user is already logged out, if so it tries to login the user again by displaying the login page.
