import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { HttpService } from "./http.service";
import { AppStateService } from "../state/app-state.service";
import { environment } from "../../environments/environment";
import { SignInOptionsDTO } from "../types/sign-in-options.dto";

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly http = inject(HttpService);
  private readonly appState = inject(AppStateService);
  private readonly router = inject(Router);

  signUp(payload: { name: string; email: string; password: string; acceptTerms: boolean; discovery?: string | null }, headers: Record<string, string> = {}) {
    return this.http.post(`${environment.apiUrl}/v1/auth/signup`, payload, headers);
  }

  signIn(payload: SignInOptionsDTO, headers: Record<string, string> = {}) {
    return this.http.post(`${environment.apiUrl}/v1/auth/signin`, payload, headers);
  }

  checkCode(payload: { code: string; keepConected: boolean }) {
    return this.http.patch(`${environment.apiUrl}/v1/auth/codes`, payload);
  }

  sendCode(email: string) {
    return this.http.post(`${environment.apiUrl}/v1/auth/codes`, { email });
  }

  forgotPassword(email: string) {
    return this.http.post(`${environment.apiUrl}/v1/auth/forgot-passwords`, { email });
  }

  resetPassword(password: string, token: string) {
    return this.http.patch(`${environment.apiUrl}/v1/auth/reset-passwords`, { password }, {
      Authorization: `Bearer ${token}`,
    });
  }

  verifyToken() {
    return this.http.get(`${environment.apiUrl}/v1/auth/verify`);
  }

  me() {
    return this.http.get(`${environment.apiUrl}/v1/auth/me`);
  }

  signOut() {
    this.appState.user.set(null);
    this.appState.token.set(null);
    localStorage.removeItem("auth_token");
    this.router.navigate(["/auth/signin"]);
  }

  getAuthFlowId(id: string) {
    return this.http.get(`${environment.apiUrl}/v1/auth/flows/${id}`);
  }
}
