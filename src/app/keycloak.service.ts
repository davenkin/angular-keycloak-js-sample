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
    // refresh the access token upon previous token expired
    // if the refresh operation response error(such as refresh token expired which results in 400 error), it calls Keycloak.clearToken() internally
    // Keycloak.clearToken() will call onAuthLogout, and if configured as `login-required`, it will automatically call login() which shows the login page
    // so there is no need to explicitly call Keycloak.login() by yourself
    this.keycloak.onTokenExpired = () => {
      this.keycloak.updateToken();
    };

    return this.keycloak.init({onLoad: 'login-required'});
  }

  requireLogin() {
    if (!this.keycloak.authenticated || this.keycloak.isTokenExpired()) {
      this.keycloak.login();
    }
  }
}
