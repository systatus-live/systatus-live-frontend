import { Injectable, inject } from "@angular/core";
import { HttpService } from "./http.service";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class Interval {
  private readonly http = inject(HttpService);

  getIntervalList(params: URLSearchParams) {
    return this.http.get(`${environment.apiUrl}/v1/intervals?${params.toString()}`);
  }
}
