import { HttpInterceptorFn } from "@angular/common/http";
import { inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { finalize } from "rxjs";
import { AppStateService } from "../state/app-state.service";
import { environment } from "../../environments/environment";

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const appState = inject(AppStateService);

  if (!isPlatformBrowser(platformId) || !req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  appState.increment();

  return next(req).pipe(
    finalize(() => appState.decrement()),
  );
};
