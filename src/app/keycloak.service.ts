import {Injectable} from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({providedIn: 'root'})
export class KeycloakService {
  keycloak: Keycloak;

  constructor() {
    this.keycloak = new Keycloak({
      url: "http://localhost:8080",
      realm: "test-realm",
      clientId: "test-client"
    });
  }

  init() {
    return this.keycloak.init({onLoad: 'login-required'});
  }

  requireLogin() {
    if (!this.keycloak.authenticated || this.keycloak.isTokenExpired()) {
      this.keycloak.login();
    }
  }
}
