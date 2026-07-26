import { Injectable, inject } from "@angular/core";
import { HttpService } from "./http.service";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class Incident {
  private readonly http = inject(HttpService);

  getIncidentList(params: URLSearchParams) {
    return this.http.get(`${environment.apiUrl}/v1/incidents?${params.toString()}`);
  }

  getHistorical() {
    return this.http.get(`${environment.apiUrl}/v1/incidents/historical`);
  }
}
