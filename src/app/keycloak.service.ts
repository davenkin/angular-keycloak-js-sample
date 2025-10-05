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
    // no need to do this for Keycloak.onAuthRefreshError and Keycloak.onAuthLogout as they will facilitate Keycloak.login() automatically once `session status iframe` is enabled.
    this.keycloak.onTokenExpired = () => {
      this.keycloak.updateToken();
    };

    return this.keycloak.init({onLoad: 'login-required'});
  }
}
