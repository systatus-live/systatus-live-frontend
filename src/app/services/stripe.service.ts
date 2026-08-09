import { Injectable, inject } from "@angular/core";
import { HttpService } from "./http.service";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class Stripe {
  private readonly http = inject(HttpService);

  createCheckoutSession(planId: string) {
    return this.http.post(`${environment.apiUrl}/v1/stripe/checkout`, { planId });
  }
}
