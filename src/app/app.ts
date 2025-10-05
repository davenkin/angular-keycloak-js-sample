import {Component} from '@angular/core';
import {KeycloakService} from './keycloak.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  constructor(protected keycloakService: KeycloakService) {
  }
}
