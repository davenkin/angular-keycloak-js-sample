import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  constructor(protected httpClient: HttpClient) {
  }

  action() {
    this.httpClient.get('http://localhost:8080/realms/test-realm/.well-known/openid-configuration').subscribe(res => {
      console.info(res);
    });
  }
}
