import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { environment } from "../../environments/environment";
import { AuthService } from "../services/auth.service";

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message: string;

      if (error.status === 0) {
        message = "Sem conexão com o servidor.";
      } else if (typeof error.error === "object" && error.error !== null && !Array.isArray(error.error)) {
        message = error.error.message ?? error.message;
      } else {
        message = error.message;
      }

      if (error.status === 401 && req.url.startsWith(environment.apiUrl)) {
        authService.signOut();
      }

      return throwError(() => ({
        status: error.status,
        data: error.error,
        message,
      }));
    }),
  );
};
