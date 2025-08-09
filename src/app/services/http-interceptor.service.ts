import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { LoadingService } from './loading.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(
    private loadingService: LoadingService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingService.setLoading(true);

    const cacheLanguage = localStorage.getItem("language");
    let authReq = req.clone({
      headers: req.headers.append("Accept-Language", cacheLanguage || "pt-br")
    });

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      }),
      finalize(() => {
        this.loadingService.setLoading(false);
      })
    )
  }
}