import { Injectable, inject } from "@angular/core";
import { HttpService } from "./http.service";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class Integration {
  private readonly http = inject(HttpService);

  getIntegrationList(params: URLSearchParams) {
    return this.http.get(`${environment.apiUrl}/v1/integrations?${params.toString()}`);
  }

  getIntegrationById(id: string) {
    return this.http.get(`${environment.apiUrl}/v1/integrations/${id}`);
  }

  createIntegration(data: any) {
    return this.http.post(`${environment.apiUrl}/v1/integrations`, data);
  }

  updateIntegration(id: string, data: any) {
    return this.http.put(`${environment.apiUrl}/v1/integrations/${id}`, data);
  }

  deleteIntegration(id: string) {
    return this.http.delete(`${environment.apiUrl}/v1/integrations/${id}`);
  }

  validateIntegration(id: string) {
    return this.http.post(`${environment.apiUrl}/v1/integrations/validates`, { id });
  }

  getTemplateDefaults() {
    return this.http.get(`${environment.apiUrl}/v1/integrations/templates/defaults`);
  }
}
