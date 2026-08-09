import { Injectable, inject } from "@angular/core";
import { HttpService } from "./http.service";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class StatusPage {
  private readonly http = inject(HttpService);

  getPublicStatusPage(slug: string) {
    return this.http.get(`${environment.apiUrl}/v1/status-page/public/${slug}`);
  }

  getStatusPage() {
    return this.http.get(`${environment.apiUrl}/v1/status-page`);
  }

  createStatusPage(data: any) {
    return this.http.post(`${environment.apiUrl}/v1/status-page`, data);
  }

  updateStatusPage(data: any) {
    return this.http.put(`${environment.apiUrl}/v1/status-page`, data);
  }
}
