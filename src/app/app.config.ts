import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';
import { MessageService } from 'primeng/api';
import { HttpClient, provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    // Angular
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    // PrimeNG
    providePrimeNG({
      theme: {
        preset: Aura
      }
    }),
    MessageService,
    // Lottie
    provideLottieOptions({
      player: () => player,
    }),
  ],
};