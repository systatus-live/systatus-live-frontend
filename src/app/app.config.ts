import { ApplicationConfig, inject, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';
import { MessageService } from 'primeng/api';
import { HTTP_INTERCEPTORS, HttpClient, HttpHandlerFn, HttpRequest, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { DialogService } from 'primeng/dynamicdialog';
import { LoadingService } from './services/loading.service';
import { HttpInterceptorService } from './services/http-interceptor.service';

export const appConfig: ApplicationConfig = {
  providers: [
    // Angular
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    },
    // PrimeNG
    providePrimeNG({
      theme: {
        preset: Aura
      }
    }),
    MessageService,
    DialogService,
    // Lottie
    provideLottieOptions({
      player: () => player,
    }),
  ],
};