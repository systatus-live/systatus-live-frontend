import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class HttpService {
  private readonly http = inject(HttpClient);

  get<T = any>(url: string, headers: Record<string, string> = {}): Observable<T> {
    return this.http.get<T>(url, {
      headers: new HttpHeaders(headers),
      withCredentials: true,
    });
  }

  post<T = any>(url: string, payload: any, headers: Record<string, string> = {}): Observable<T> {
    return this.http.post<T>(url, payload, {
      headers: new HttpHeaders(headers),
      withCredentials: true,
    });
  }

  put<T = any>(url: string, payload: any, headers: Record<string, string> = {}): Observable<T> {
    return this.http.put<T>(url, payload, {
      headers: new HttpHeaders(headers),
      withCredentials: true,
    });
  }

  patch<T = any>(url: string, payload: any, headers: Record<string, string> = {}): Observable<T> {
    return this.http.patch<T>(url, payload, {
      headers: new HttpHeaders(headers),
      withCredentials: true,
    });
  }

  delete<T = any>(url: string, headers: Record<string, string> = {}): Observable<T> {
    return this.http.delete<T>(url, {
      headers: new HttpHeaders(headers),
      withCredentials: true,
    });
  }
}
