import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePtBr from '@angular/common/locales/pt';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { httpErrorInterceptor } from './interceptors/http-error-interceptor';
import { jwtInterceptor } from './interceptors/jwt-interceptor';
import { loadingInterceptor } from './interceptors/loading-interceptor';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { routes } from './app.routes';
import { NgxPermissionsModule } from 'ngx-permissions';

registerLocaleData(localePtBr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptors([jwtInterceptor, loadingInterceptor, httpErrorInterceptor])),
    importProvidersFrom(NgxPermissionsModule.forRoot()),
    {
      provide: LOCALE_ID,
      useValue: 'pt'
    },
  ],
};
