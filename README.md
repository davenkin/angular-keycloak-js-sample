## Introduction

This is a sample project for using [Keycloak JavaScript adapter](https://www.keycloak.org/securing-apps/javascript-adapter) in Angular project.

This application requires the user to be logged in for all its pages, this actually simplifies the authentication mechanism by only checking the user's login status at a single place early in the application's initialization process.

## Tech stack
- Angular 20.3.0
- keycloak-js 26.2.0

## Local run
- First start Keycloak server: `docker run --rm -p 8080:8080 -e KC_BOOTSTRAP_ADMIN_USERNAME=admin -e KC_BOOTSTRAP_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:26.4.0 start-dev`, this starts the Keycloak server at [http://localhost:8080](http://localhost:8080) with an admin user named `admin` and password `admin`
- In the Keycloak server UI, create the following resources:
  - Create a realm named `test-realm`
  - In `test-realm`, create a client `test-client` with the following configurations:
    - `Client authentication` set to `off` as the Angular application is a public client
    - `Authentication flow` set to `Standard flow` to enable the Oauth2 authorization flow 
    - `Valid redirect URIs` set to `http://localhost:4200/*`, which points our the local Angular application
    - `Web origins` set to `*` to allow all domains for CORS requests, only for testing purpose
  - In `test-realm`, create a user `test-user`
- Run `npm start`, then open your browser and navigate to [http://localhost:4200/](http://localhost:4200/).
