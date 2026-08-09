import { Injectable, inject } from "@angular/core";
import { HttpService } from "./http.service";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class User {
  private readonly http = inject(HttpService);

  getAuthHistory(params: URLSearchParams) {
    return this.http.get(`${environment.apiUrl}/v1/users/auth-history?${params.toString()}`);
  }

  updateUserDetails(formData: FormData) {
    return this.http.patch(`${environment.apiUrl}/v1/users/details`, formData);
  }

  updateUserPassword(data: any) {
    return this.http.patch(`${environment.apiUrl}/v1/users/passwords`, data);
  }

  getUserSubscription() {
    return this.http.get(`${environment.apiUrl}/v1/users/subscriptions`);
  }

  getUserBillingData() {
    return this.http.get(`${environment.apiUrl}/v1/users/billing`);
  }

  updateUserBillingData(data: any) {
    return this.http.patch(`${environment.apiUrl}/v1/users/billing`, data);
  }
}
