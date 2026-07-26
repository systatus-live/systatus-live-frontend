import { HttpInterceptorFn } from "@angular/common/http";
import { inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { AppStateService } from "../state/app-state.service";
import { environment } from "../../environments/environment";

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const appState = inject(AppStateService);

  if (!isPlatformBrowser(platformId)) {
    return next(req);
  }

  if (!req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  const token = appState.token() ?? localStorage.getItem("auth_token");

  if (!token) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    }),
  );
};
