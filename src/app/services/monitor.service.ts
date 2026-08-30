import { Injectable, inject } from "@angular/core";
import { HttpService } from "./http.service";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class MonitorService {
  private readonly http = inject(HttpService);

  getMonitorList(params: URLSearchParams) {
    return this.http.get(`${environment.apiUrl}/v1/monitors?${params.toString()}`);
  }

  getMonitorById(id: string) {
    return this.http.get(`${environment.apiUrl}/v1/monitors/${id}`);
  }

  createMonitor(data: any) {
    return this.http.post(`${environment.apiUrl}/v1/monitors`, data);
  }

  updateMonitor(id: string, data: any) {
    return this.http.put(`${environment.apiUrl}/v1/monitors/${id}`, data);
  }

  deleteMonitor(id: string) {
    return this.http.delete(`${environment.apiUrl}/v1/monitors/${id}`);
  }

  getMonitorHistorical(id: string) {
    return this.http.get(`${environment.apiUrl}/v1/monitors/${id}/historical`);
  }
}
