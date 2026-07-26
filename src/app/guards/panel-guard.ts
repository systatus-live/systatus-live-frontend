import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { catchError, map, of } from "rxjs";
import { AuthService } from "../services/auth.service";

export const panelGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const token = localStorage.getItem("auth_token");

  if (!token) {
    return router.createUrlTree(["/auth/signin"]);
  }

  return authService.verifyToken().pipe(
    map(() => true),
    catchError((error) => {
      localStorage.removeItem("auth_token");
      
      if (error.data?.needVerifyFlow === true) {
        return of(router.createUrlTree(["/auth/verify-account"], {
          queryParams: {
            authFlowId: error.data.authFlowId
          }
        }));
      }

      return of(router.createUrlTree(["/auth/signin"]));
    })
  );
};
