import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import {KeycloakService} from './keycloak.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideAppInitializer(async () => {
      try {
        const keycloakService = inject(KeycloakService);
        return await keycloakService.init();
      } catch (error) {
        console.error('Error while initialize keycloak.', error);
        throw error;
      }
    }),
  ]
};
