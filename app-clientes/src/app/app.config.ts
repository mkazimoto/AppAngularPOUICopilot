import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import localePtBr from '@angular/common/locales/pt';
import {
  ApplicationConfig,
  importProvidersFrom,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';

import { PoHttpRequestModule } from '@po-ui/ng-components';

registerLocaleData(localePtBr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimations(),
    provideRouter(routes),
    importProvidersFrom([PoHttpRequestModule]),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: LOCALE_ID, useValue: 'pt' },
  ],
};
